// src/lib/env/utils.ts
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development"
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

export function isTest(): boolean {
  return process.env.NODE_ENV === "test"
}

export function getEnv(key: string): string | undefined {
  return process.env[key]
}

export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}
