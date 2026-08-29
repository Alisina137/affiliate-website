// src/lib/env/index.ts
import { ZodError } from "zod"
import { envSchema, type Env } from "./schema"

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("❌ Invalid environment variables:")
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

export const env = validateEnv()

// Helper functions
export function isDevelopment(): boolean {
  return env.NODE_ENV === "development"
}

export function isProduction(): boolean {
  return env.NODE_ENV === "production"
}

export function isTest(): boolean {
  return env.NODE_ENV === "test"
}

export function getEnv(key: keyof Env): string {
  const value = env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value as string
}

export function getOptionalEnv<T extends keyof Env>(key: T): Env[T] | undefined {
  return env[key]
}
