// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

  // Fetch all content
  const [products, categories, brands, reviews, comparisons, bestOfs, guides, statistics, articles] = await Promise.all([
    db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.brand.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.review.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    db.comparison.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    db.bestOf.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    db.guide.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    db.statistic.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    db.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ])

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // Static pages
  const staticPages = [
    { url: "", priority: 1.0, freq: "daily" },
    { url: "/categories", priority: 0.8, freq: "weekly" },
    { url: "/brands", priority: 0.7, freq: "weekly" },
    { url: "/reviews", priority: 0.8, freq: "weekly" },
    { url: "/comparisons", priority: 0.7, freq: "weekly" },
    { url: "/guides", priority: 0.8, freq: "weekly" },
    { url: "/best", priority: 0.7, freq: "weekly" },
    { url: "/statistics", priority: 0.6, freq: "weekly" },
    { url: "/about", priority: 0.5, freq: "monthly" },
    { url: "/contact", priority: 0.4, freq: "monthly" },
  ]

  staticPages.forEach((page) => {
    xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  })

  // Products
  products.forEach((product) => {
    xml += `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  })

  // Categories
  categories.forEach((category) => {
    xml += `
  <url>
    <loc>${baseUrl}/categories/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  // Brands
  brands.forEach((brand) => {
    xml += `
  <url>
    <loc>${baseUrl}/brands/${brand.slug}</loc>
    <lastmod>${brand.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  })

  // Reviews
  reviews.forEach((review) => {
    xml += `
  <url>
    <loc>${baseUrl}/reviews/${review.slug}</loc>
    <lastmod>${review.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  // Comparisons
  comparisons.forEach((comparison) => {
    xml += `
  <url>
    <loc>${baseUrl}/comparisons/${comparison.slug}</loc>
    <lastmod>${comparison.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  })

  // Best Ofs
  bestOfs.forEach((bestOf) => {
    xml += `
  <url>
    <loc>${baseUrl}/best/${bestOf.slug}</loc>
    <lastmod>${bestOf.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  })

  // Guides
  guides.forEach((guide) => {
    xml += `
  <url>
    <loc>${baseUrl}/guides/${guide.slug}</loc>
    <lastmod>${guide.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  // Statistics
  statistics.forEach((statistic) => {
    xml += `
  <url>
    <loc>${baseUrl}/statistics/${statistic.slug}</loc>
    <lastmod>${statistic.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  })

  // Articles
  articles.forEach((article) => {
    xml += `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  })

  xml += `
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  })
}
