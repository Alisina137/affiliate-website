// src/lib/secrets.ts
import { env } from "./env"

export const secrets = {
  // Database
  databaseUrl: env.DATABASE_URL,

  // Auth
  nextAuthSecret: env.NEXTAUTH_SECRET,
  nextAuthUrl: env.NEXTAUTH_URL,

  // AI Providers
  openaiApiKey: env.OPENAI_API_KEY,
  anthropicApiKey: env.ANTHROPIC_API_KEY,

  // Analytics
  gaMeasurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  plausibleDomain: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,

  // Email
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM,
  },

  // App
  siteUrl: env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
}

// Check if all required production secrets are set
export function validateProductionSecrets(): string[] {
  const missing: string[] = []

  if (!secrets.databaseUrl) missing.push("DATABASE_URL")
  if (!secrets.nextAuthSecret) missing.push("NEXTAUTH_SECRET")
  if (!secrets.nextAuthUrl) missing.push("NEXTAUTH_URL")
  if (!secrets.siteUrl) missing.push("NEXT_PUBLIC_SITE_URL")

  // Check email for production
  if (secrets.isProduction) {
    if (!secrets.smtp.host) missing.push("SMTP_HOST")
    if (!secrets.smtp.user) missing.push("SMTP_USER")
    if (!secrets.smtp.pass) missing.push("SMTP_PASS")
    if (!secrets.smtp.from) missing.push("EMAIL_FROM")
  }

  return missing
}

// Get a secret safely (throws if missing in production)
export function getSecret<T>(key: string, value: T | undefined, requiredInProduction: boolean = true): T {
  if (!value && requiredInProduction && secrets.isProduction) {
    throw new Error(`Missing required secret: ${key}`)
  }
  if (!value) {
    console.warn(`⚠️ Optional secret not set: ${key}`)
  }
  return value as T
}
