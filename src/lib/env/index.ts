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
