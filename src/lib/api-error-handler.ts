// src/lib/api-error-handler.ts
import { NextResponse } from "next/server"
import { AppError, createErrorResponse } from "./error-handler"
import { logger } from "./logger"

export function handleApiError(error: unknown): NextResponse {
  const { error: errorResponse, status } = createErrorResponse(error)

  // Log the error with additional context
  if (error instanceof AppError) {
    logger.error(`API Error: ${error.message}`, error, {
      status: error.status,
      code: error.code,
    })
  }

  return NextResponse.json(errorResponse, { status })
}

export function validateApiRequest<T>(
  data: T,
  validator: (data: T) => boolean,
  message: string = "Invalid request data"
): T {
  if (!validator(data)) {
    throw new AppError(message, "VALIDATION_ERROR", 400)
  }
  return data
}

export function requireAuth(session: any): void {
  if (!session) {
    throw new AppError("Authentication required", "UNAUTHORIZED", 401)
  }

  if (session.user?.role !== "ADMIN") {
    throw new AppError("Admin access required", "FORBIDDEN", 403)
  }
}
