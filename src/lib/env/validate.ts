// src/lib/env/validate.ts
import { config } from "@/config"

export function validateEnvironment(): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Required for all environments
  if (!config.database.url) {
    errors.push("DATABASE_URL is required")
  }

  if (!config.auth.secret) {
    errors.push("NEXTAUTH_SECRET is required")
  }

  if (!config.auth.url) {
    errors.push("NEXTAUTH_URL is required")
  }

  // Production-specific validation
  if (config.isProduction) {
    if (!config.email.host) {
      errors.push("SMTP_HOST is required in production")
    }
    if (!config.email.user) {
      errors.push("SMTP_USER is required in production")
    }
    if (!config.email.pass) {
      errors.push("SMTP_PASS is required in production")
    }
    if (!config.email.from) {
      errors.push("EMAIL_FROM is required in production")
    }

    // Check for development secrets in production
    if (config.auth.secret && config.auth.secret.length < 32) {
      warnings.push("NEXTAUTH_SECRET should be at least 32 characters")
    }
  }

  // Warning for missing analytics
  if (config.features.enableAnalytics && !config.analytics.gaMeasurementId) {
    warnings.push("Analytics enabled but GA_MEASUREMENT_ID is not set")
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function logEnvironmentValidation(): void {
  const { valid, errors, warnings } = validateEnvironment()

  console.log("🔍 Environment Validation:")
  console.log("")

  if (valid) {
    console.log("✅ All required variables are set")
  } else {
    console.log("❌ Missing required variables:")
    errors.forEach((err) => console.log(`  - ${err}`))
  }

  if (warnings.length > 0) {
    console.log("")
    console.log("⚠️ Warnings:")
    warnings.forEach((warn) => console.log(`  - ${warn}`))
  }

  if (!valid) {
    process.exit(1)
  }
}
