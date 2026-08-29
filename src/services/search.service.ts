// src/services/search.service.ts
import { db } from "@/lib/db"

export interface SearchResult {
  id: string
  title: string
  slug: string
  type: "product" | "review" | "comparison" | "guide" | "article" | "brand" | "category"
  excerpt?: string | null
  image?: string | null
  url: string
  rating?: number | null
  price?: number | null
  currency?: string
  relevance: number
}

export interface SearchParams {
  query: string
  type?: "product" | "review" | "comparison" | "guide" | "article" | "brand" | "category" | "all"
  categoryId?: string
  brandId?: string
  nicheId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "relevance" | "createdAt" | "price" | "rating"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}

export const searchService = {
  // Perform site-wide search
  async search(params: SearchParams): Promise<{
    results: SearchResult[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const {
      query,
      type = "all",
      categoryId,
      brandId,
      nicheId,
      minPrice,
      maxPrice,
      sortBy = "relevance",
      sortOrder = "desc",
      limit = 20,
      offset = 0,
    } = params

    if (!query || query.length < 2) {
      return {
        results: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
      }
    }

    const searchTerm = query.trim().toLowerCase()

    // Initialize results arrays
    let productResults: SearchResult[] = []
    let reviewResults: SearchResult[] = []
    let comparisonResults: SearchResult[] = []
    let guideResults: SearchResult[] = []
    let brandResults: SearchResult[] = []
    let categoryResults: SearchResult[] = []
    const articleResults: SearchResult[] = []

    // Search products
    if (type === "all" || type === "product") {
      const products = await db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { shortDescription: { contains: searchTerm, mode: "insensitive" } },
            { brand: { name: { contains: searchTerm, mode: "insensitive" } } },
          ],
          ...(categoryId && { categoryId }),
          ...(brandId && { brandId }),
          ...(nicheId && { nicheId }),
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        },
        include: {
          brand: true,
          category: true,
        },
        take: type === "all" ? 5 : limit,
        orderBy: sortBy === "price" ? { price: sortOrder } : sortBy === "rating" ? { rating: sortOrder } : { createdAt: sortOrder },
      })

      productResults = products.map((p) => ({
        id: p.id,
        title: p.name,
        slug: p.slug,
        type: "product" as const,
        excerpt: p.shortDescription || p.description,
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        url: `/products/${p.slug}`,
        rating: p.rating,
        price: p.price,
        currency: p.currency,
        relevance: p.name.toLowerCase().includes(searchTerm) ? 1 : 0.5,
      }))
    }

    // Search reviews
    if (type === "all" || type === "review") {
      const reviews = await db.review.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            { excerpt: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          product: true,
        },
        take: type === "all" ? 3 : limit,
        orderBy: { createdAt: "desc" },
      })

      reviewResults = reviews.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        type: "review" as const,
        excerpt: r.excerpt || r.content?.substring(0, 200),
        image: null,
        url: `/reviews/${r.slug}`,
        rating: r.rating,
        relevance: r.title.toLowerCase().includes(searchTerm) ? 1 : 0.5,
      }))
    }

    // Search comparisons
    if (type === "all" || type === "comparison") {
      const comparisons = await db.comparison.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: type === "all" ? 3 : limit,
        orderBy: { createdAt: "desc" },
      })

      comparisonResults = comparisons.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        type: "comparison" as const,
        excerpt: c.excerpt || c.content?.substring(0, 200),
        image: null,
        url: `/comparisons/${c.slug}`,
        rating: null,
        relevance: c.title.toLowerCase().includes(searchTerm) ? 1 : 0.5,
      }))
    }

    // Search guides
    if (type === "all" || type === "guide") {
      const guides = await db.guide.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            { introduction: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: type === "all" ? 3 : limit,
        orderBy: { createdAt: "desc" },
      })

      guideResults = guides.map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        type: "guide" as const,
        excerpt: g.excerpt || g.introduction || g.content?.substring(0, 200),
        image: null,
        url: `/guides/${g.slug}`,
        rating: null,
        relevance: g.title.toLowerCase().includes(searchTerm) ? 1 : 0.5,
      }))
    }

    // Search brands
    if (type === "all" || type === "brand") {
      const brands = await db.brand.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
        take: type === "all" ? 3 : limit,
        orderBy: { name: "asc" },
      })

      brandResults = brands.map((b) => ({
        id: b.id,
        title: b.name,
        slug: b.slug,
        type: "brand" as const,
        excerpt: b.description || `${b._count.products} products`,
        image: b.logo,
        url: `/brands/${b.slug}`,
        rating: null,
        relevance: b.name.toLowerCase().includes(searchTerm) ? 1 : 0.5,
      }))
    }

    // Search categories
    if (type === "all" || type === "category") {
      const categories = await db.category.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          niche: true,
          _count: {
            select: { products: true },
          },
        },
        take: type === "all" ? 3 : limit,
        orderBy: { name: "asc" },
      })

      categoryResults = categories.map((c) => ({
        id: c.id,
        title: c.name,
        slug: c.slug,
        type: "category" as const,
        excerpt: c.description || `${c._count.products} products`,
        image: c.image,
        url: `/categories/${c.slug}`,
        rating: null,
        relevance: c.name.toLowerCase().includes(searchTerm) ? 1 : 0.5,
      }))
    }

    // Combine and sort results
    const allResults = [
      ...productResults,
      ...reviewResults,
      ...comparisonResults,
      ...guideResults,
      ...brandResults,
      ...categoryResults,
      ...articleResults,
    ]

    // Calculate relevance score
    const sortedResults = allResults
      .map((r) => ({
        ...r,
        relevance: r.relevance * (r.title.toLowerCase().includes(searchTerm) ? 2 : 1),
      }))
      .sort((a, b) => {
        if (sortBy === "relevance") {
          return b.relevance - a.relevance
        }
        if (sortBy === "createdAt") {
          // For simplicity, we'll use relevance for now
          return b.relevance - a.relevance
        }
        return b.relevance - a.relevance
      })

    const total = sortedResults.length
    const paginatedResults = sortedResults.slice(offset, offset + limit)

    return {
      results: paginatedResults,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get search suggestions
  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return []
    }

    const searchTerm = query.trim().toLowerCase()

    // Get product name suggestions
    const products = await db.product.findMany({
      where: {
        isActive: true,
        name: { contains: searchTerm, mode: "insensitive" },
      },
      select: { name: true },
      take: 5,
    })

    // Get review title suggestions
    const reviews = await db.review.findMany({
      where: {
        status: "PUBLISHED",
        title: { contains: searchTerm, mode: "insensitive" },
      },
      select: { title: true },
      take: 3,
    })

    // Get brand name suggestions
    const brands = await db.brand.findMany({
      where: {
        isActive: true,
        name: { contains: searchTerm, mode: "insensitive" },
      },
      select: { name: true },
      take: 3,
    })

    const suggestions = [
      ...products.map((p) => p.name),
      ...reviews.map((r) => r.title),
      ...brands.map((b) => b.name),
    ]

    // Remove duplicates and limit
    return [...new Set(suggestions)].slice(0, 10)
  },
}
