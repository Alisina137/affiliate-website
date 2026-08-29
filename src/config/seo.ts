// src/config/seo.ts
export const defaultSEO = {
  siteName: "Affiliate Platform",
  siteDescription: "Discover reviews, comparisons, and buying guides for products across all categories.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  siteImage: "/og-image.jpg",
  twitterCard: "summary_large_image" as const,
  twitterSite: "@affiliateplatform",
  keywords: [
    "product reviews",
    "comparisons",
    "buying guides",
    "affiliate",
    "best products",
  ],
}

export const defaultOpenGraph = {
  type: "website",
  locale: "en_US",
  siteName: defaultSEO.siteName,
}

export const defaultTwitter = {
  card: defaultSEO.twitterCard,
  site: defaultSEO.twitterSite,
}
