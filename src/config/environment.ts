// src/config/environment.ts
export const environment = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  },

  app: {
    name: "Affiliate Platform",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },

  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    enableNewsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER !== "false",
  },
}
