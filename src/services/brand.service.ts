// src/services/brand.service.ts
import { db } from "@/lib/db"

export const brandService = {
  // Get all brands
  async getAll(params?: {
    nicheId?: string
    isActive?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    const {
      nicheId,
      isActive = true,
      search,
      limit = 20,
      offset = 0,
    } = params || {}

    const where: any = { isActive }

    if (nicheId) where.nicheId = nicheId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.brand.findMany({
        where,
        include: {
          niche: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: "asc" },
        skip: offset,
        take: limit,
      }),
      db.brand.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a brand by slug
  async getBySlug(slug: string) {
    return db.brand.findUnique({
      where: { slug, isActive: true },
      include: {
        niche: true,
        products: {
          where: { isActive: true },
          include: {
            category: true,
            affiliateLinks: {
              where: { isActive: true },
              orderBy: { priority: "desc" },
            },
          },
          orderBy: { name: "asc" },
        },
        categories: {
          where: { isActive: true },
        },
      },
    })
  },

  // Get a brand by ID
  async getById(id: string) {
    return db.brand.findUnique({
      where: { id },
      include: {
        niche: true,
        products: {
          where: { isActive: true },
          take: 10,
        },
      },
    })
  },

  // Get products by brand
  async getProducts(brandId: string, params?: {
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      limit = 12,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const [products, total] = await Promise.all([
      db.product.findMany({
        where: {
          brandId,
          isActive: true,
        },
        include: {
          category: true,
          affiliateLinks: {
            where: { isActive: true },
            orderBy: { priority: "desc" },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.product.count({
        where: { brandId, isActive: true },
      }),
    ])

    return {
      products,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get brand statistics
  async getStats(brandId: string) {
    const [products, categories, reviews] = await Promise.all([
      db.product.count({
        where: { brandId, isActive: true },
      }),
      db.category.count({
        where: {
          products: {
            some: { brandId, isActive: true },
          },
        },
      }),
      db.review.count({
        where: {
          product: {
            brandId,
            isActive: true,
          },
          status: "PUBLISHED",
        },
      }),
    ])

    const avgRating = await db.product.aggregate({
      where: { brandId, isActive: true },
      _avg: { rating: true },
    })

    return {
      productCount: products,
      categoryCount: categories,
      reviewCount: reviews,
      averageRating: avgRating._avg.rating || 0,
    }
  },
}
