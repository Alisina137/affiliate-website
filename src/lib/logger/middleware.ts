// src/lib/logger/middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { logger } from "./index"

export async function loggingMiddleware(
  req: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now()
  const method = req.method
  const path = req.nextUrl.pathname
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"

  // Create a child logger with request context
  const requestLogger = logger.withContext({
    method,
    path,
    ip,
    userAgent: req.headers.get("user-agent") || "unknown",
  })

  requestLogger.info(`Request started`, {
    query: Object.fromEntries(req.nextUrl.searchParams),
  })

  try {
    const response = await handler()
    const duration = Date.now() - startTime

    requestLogger.info(`Request completed`, {
      status: response.status,
      duration,
    })

    return response
  } catch (error) {
    const duration = Date.now() - startTime
    requestLogger.error(`Request failed`, error as Error, {
      duration,
    })
    throw error
  }
}
