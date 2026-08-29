// src/lib/error-handler.ts
import { logger } from "./logger"

export interface ErrorResponse {
  error: string
  message?: string
  code?: string
  details?: any
}

export class AppError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: any

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    status: number = 500,
    details?: any
  ) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.status = status
    this.details = details
  }
}

export function handleError(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    logger.error(`AppError: ${error.message}`, error, {
      code: error.code,
      status: error.status,
      details: error.details,
    })

    return {
      error: error.message,
      code: error.code,
      details: error.details,
    }
  }

  if (error instanceof Error) {
    logger.error("Unhandled error", error)
    return {
      error: "An unexpected error occurred",
      message: error.message,
    }
  }

  logger.error("Unknown error", new Error(String(error)))
  return {
    error: "An unknown error occurred",
  }
}

export function createErrorResponse(error: unknown): {
  error: ErrorResponse
  status: number
} {
  if (error instanceof AppError) {
    return {
      error: handleError(error),
      status: error.status || 500,
    }
  }

  return {
    error: handleError(error),
    status: 500,
  }
}
