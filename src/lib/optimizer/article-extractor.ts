function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
}

function textFromHtml(html: string) {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|canvas|form|nav|footer|aside)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|section|article|h[1-6]|li|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim()
}

function firstMatch(html: string, expression: RegExp) {
  return expression.exec(html)?.[1]?.trim() || ""
}

export function extractArticle(html: string) {
  const title = decodeEntities(
    firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
    firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ")
  ).trim()

  const article = firstMatch(html, /<article\b[^>]*>([\s\S]*?)<\/article>/i)
  const main = firstMatch(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i)
  const body = firstMatch(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i)
  const content = textFromHtml(article || main || body || html)

  if (content.length < 200) throw new Error("Could not identify enough readable article content.")
  return { title: title || "Imported article", content }
}
