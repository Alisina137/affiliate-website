// src/app/sitemap.ts
import { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

  // Fetch all content in parallel
  const [
    products,
    categories,
    brands,
    reviews,
    comparisons,
    bestOfs,
    guides,
    statistics,
    articles,
  ] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    db.brand.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    db.review.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.comparison.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.bestOf.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.guide.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.statistic.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ])

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comparisons`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/statistics`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]

  // Product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Brand pages
  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Review pages
  const reviewPages = reviews.map((review) => ({
    url: `${baseUrl}/reviews/${review.slug}`,
    lastModified: review.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Comparison pages
  const comparisonPages = comparisons.map((comparison) => ({
    url: `${baseUrl}/comparisons/${comparison.slug}`,
    lastModified: comparison.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Best Of pages
  const bestOfPages = bestOfs.map((bestOf) => ({
    url: `${baseUrl}/best/${bestOf.slug}`,
    lastModified: bestOf.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Guide pages
  const guidePages = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Statistic pages
  const statisticPages = statistics.map((statistic) => ({
    url: `${baseUrl}/statistics/${statistic.slug}`,
    lastModified: statistic.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...reviewPages,
    ...comparisonPages,
    ...bestOfPages,
    ...guidePages,
    ...statisticPages,
    ...articlePages,
  ]
}
