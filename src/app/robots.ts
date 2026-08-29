// src/app/robots.ts
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/categories/",
        "/products/",
        "/brands/",
        "/reviews/",
        "/comparisons/",
        "/guides/",
        "/best/",
        "/statistics/",
        "/articles/",
        "/search",
        "/about",
        "/contact",
        "/privacy",
        "/terms",
        "/disclosure",
        "/editorial-policy",
      ],
      disallow: [
        "/admin/",
        "/api/",
        "/dashboard/",
        "/auth/",
        "/login",
        "/register",
        "/_next/",
        "/static/",
        "/images/",
        "/fonts/",
        "/*.json$",
        "/*.xml$",
        "/*.txt$",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
