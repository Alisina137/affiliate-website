// src/lib/validation/middleware.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { sanitizeObject } from "./sanitize"

export type ValidationResult<T> = {
  success: boolean
  data?: T
  error?: string
  details?: z.ZodIssue[]
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  body: unknown,
  options?: { sanitize?: boolean; html?: boolean; slug?: boolean }
): ValidationResult<T> {
  // Sanitize if requested
  let data = body
  if (options?.sanitize) {
    data = sanitizeObject(body as any, {
      html: options.html,
      slug: options.slug,
    })
  }

  const result = schema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      details: result.error.issues,
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

export function validateApiRequest<T>(
  schema: z.ZodSchema<T>,
  body: unknown,
  options?: { sanitize?: boolean; html?: boolean; slug?: boolean }
): { data: T; errors?: { message: string; details?: z.ZodIssue[] } } {
  const validation = validateRequest(schema, body, options)

  if (!validation.success) {
    return {
      data: {} as T,
      errors: {
        message: validation.error || "Validation failed",
        details: validation.details,
      },
    }
  }

  return { data: validation.data as T }
}

// Helper for API routes
export function validateAndRespond<T>(
  schema: z.ZodSchema<T>,
  body: unknown,
  options?: { sanitize?: boolean; html?: boolean; slug?: boolean }
):
  | { success: true; data: T }
  | { success: false; response: ReturnType<typeof NextResponse.json> } {
  const validation = validateRequest(schema, body, options)

  if (!validation.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: validation.error,
          details: validation.details,
        },
        { status: 400 }
      ),
    }
  }

  return {
    success: true,
    data: validation.data as T,
  }
}
