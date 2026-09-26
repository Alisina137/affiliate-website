import { lookup } from "node:dns/promises"
import http from "node:http"
import https from "node:https"
import { isIP } from "node:net"

const MAX_BYTES = 2 * 1024 * 1024
const TIMEOUT_MS = 10_000
const MAX_REDIRECTS = 4

export class SafeFetchError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = "SafeFetchError"
  }
}

function isPrivateIPv4(ip: string) {
  const p = ip.split(".").map(Number)
  return p[0] === 0 || p[0] === 10 || p[0] === 127 ||
    (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    p[0] >= 224
}

function isPrivateIPv6(ip: string) {
  const value = ip.toLowerCase().split("%")[0]
  return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") ||
    value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb") ||
    value.startsWith("ff") || value.startsWith("::ffff:127.") || value.startsWith("::ffff:10.") ||
    value.startsWith("::ffff:192.168.")
}

export function isPrivateAddress(ip: string) {
  const family = isIP(ip)
  if (family === 4) return isPrivateIPv4(ip)
  if (family === 6) return isPrivateIPv6(ip)
  return true
}

export async function resolvePublicAddress(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/\.$/, "")
  if (normalized === "localhost" || normalized.endsWith(".localhost") || normalized.endsWith(".local")) {
    throw new SafeFetchError("Local and internal hosts are not allowed.", "BLOCKED_HOST")
  }

  if (isIP(normalized)) {
    if (isPrivateAddress(normalized)) throw new SafeFetchError("Private or internal IP addresses are not allowed.", "BLOCKED_IP")
    return { address: normalized, family: isIP(normalized) as 4 | 6 }
  }

  let addresses: Awaited<ReturnType<typeof lookup>>
  try {
    addresses = await lookup(normalized, { all: true, verbatim: true })
  } catch {
    throw new SafeFetchError("The article host could not be resolved.", "DNS_FAILED")
  }
  if (!addresses.length || addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new SafeFetchError("The article host resolves to a private or internal address.", "BLOCKED_IP")
  }
  return addresses[0]
}

type SafeHtmlResponse = { finalUrl: string; html: string; contentType: string }

export async function safeFetchHtml(input: string, redirectCount = 0): Promise<SafeHtmlResponse> {
  let url: URL
  try { url = new URL(input) } catch { throw new SafeFetchError("Invalid article URL.", "INVALID_URL") }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SafeFetchError("Only HTTP and HTTPS article URLs are allowed.", "INVALID_PROTOCOL")
  }
  if (url.username || url.password) throw new SafeFetchError("URLs containing credentials are not allowed.", "INVALID_URL")
  if (redirectCount > MAX_REDIRECTS) throw new SafeFetchError("Too many redirects.", "TOO_MANY_REDIRECTS")

  const resolved = await resolvePublicAddress(url.hostname)
  const transport = url.protocol === "https:" ? https : http

  return new Promise((resolve, reject) => {
    const request = transport.request(url, {
      method: "GET",
      headers: { "User-Agent": "AffiliateOptimizer/1.0 (+article-analysis)", Accept: "text/html,application/xhtml+xml" },
      lookup: (_hostname, _options, callback) => callback(null, resolved.address, resolved.family),
      ...(url.protocol === "https:" ? { servername: url.hostname } : {}),
    }, (response) => {
      const status = response.statusCode ?? 0
      if (status >= 300 && status < 400 && response.headers.location) {
        response.resume()
        const nextUrl = new URL(response.headers.location, url).toString()
        safeFetchHtml(nextUrl, redirectCount + 1).then(resolve, reject)
        return
      }
      if (status < 200 || status >= 300) {
        response.resume()
        reject(new SafeFetchError(`Article URL returned HTTP ${status}.`, "HTTP_ERROR"))
        return
      }

      const contentType = String(response.headers["content-type"] || "").toLowerCase()
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        response.resume()
        reject(new SafeFetchError("The URL did not return an HTML document.", "INVALID_CONTENT_TYPE"))
        return
      }

      const declaredLength = Number(response.headers["content-length"] || 0)
      if (declaredLength > MAX_BYTES) {
        response.resume()
        reject(new SafeFetchError("The article response is too large.", "RESPONSE_TOO_LARGE"))
        return
      }

      const chunks: Buffer[] = []
      let total = 0
      response.on("data", (chunk: Buffer) => {
        total += chunk.length
        if (total > MAX_BYTES) {
          request.destroy(new SafeFetchError("The article response is too large.", "RESPONSE_TOO_LARGE"))
          return
        }
        chunks.push(chunk)
      })
      response.on("end", () => resolve({ finalUrl: url.toString(), html: Buffer.concat(chunks).toString("utf8"), contentType }))
    })

    request.setTimeout(TIMEOUT_MS, () => request.destroy(new SafeFetchError("The article request timed out.", "TIMEOUT")))
    request.on("error", (error) => reject(error instanceof SafeFetchError ? error : new SafeFetchError("Could not fetch the article URL.", "FETCH_FAILED")))
    request.end()
  })
}
