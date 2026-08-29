// src/config/index.ts
import { environment } from "./environment"

export const config = {
  app: {
    name: environment.app.name,
    url: environment.app.url,
  },

  api: {
    baseUrl: environment.api.baseUrl || environment.app.url,
  },

  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  analytics: {
    enabled: environment.features.enableAnalytics,
    gaMeasurementId: environment.analytics.gaMeasurementId,
    plausibleDomain: environment.analytics.plausibleDomain,
  },

  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },

  features: {
    enableAnalytics: environment.features.enableAnalytics,
    enableNewsletter: environment.features.enableNewsletter,
  },

  isDevelopment: environment.isDevelopment,
  isProduction: environment.isProduction,
  isTest: environment.isTest,
}

export type Config = typeof config
