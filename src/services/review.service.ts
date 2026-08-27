// src/services/review.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type ReviewCreateInput = {
  title: string
  slug: string
  productId: string
  authorId: string
  content?: string
  excerpt?: string
  rating?: number
  pros?: string[]
  cons?: string[]
  verdict?: string
  bestFor?: string
  featured?: boolean
  seoTitle?: string
  metaDescription?: string
  contentBlocks?: Prisma.InputJsonValue
}

type ReviewUpdateInput = Partial<ReviewCreateInput>

export const reviewService = {
  // Get all reviews with filtering
  async getAll(params?: {
    productId?: string
    authorId?: string
    status?: string
    featured?: boolean
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      productId,
      authorId,
      status,
      featured,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.ReviewWhereInput = {}

    if (productId) where.productId = productId
    if (authorId) where.authorId = authorId
    if (status) where.status = status
    if (featured !== undefined) where.featured = featured
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          product: {
            include: {
              brand: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.review.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a review by slug
  async getBySlug(slug: string) {
    return db.review.findUnique({
      where: { slug },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            affiliateLinks: {
              where: { isActive: true },
              orderBy: { priority: "desc" },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })
  },

  // Get a review by ID
  async getById(id: string) {
    return db.review.findUnique({
      where: { id },
      include: {
        product: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })
  },

  // Create a review
  async create(data: ReviewCreateInput) {
    return db.review.create({
      data: {
        title: data.title,
        slug: data.slug,
        productId: data.productId,
        authorId: data.authorId,
        content: data.content,
        excerpt: data.excerpt,
        rating: data.rating,
        pros: data.pros || [],
        cons: data.cons || [],
        verdict: data.verdict,
        bestFor: data.bestFor,
        featured: data.featured || false,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        contentBlocks: data.contentBlocks,
      },
    })
  },

  // Update a review
  async update(id: string, data: ReviewUpdateInput) {
    return db.review.update({
      where: { id },
      data,
    })
  },

  // Delete a review
  async delete(id: string) {
    return db.review.delete({
      where: { id },
    })
  },

  // Publish a review
  async publish(id: string) {
    return db.review.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  },

  // Get reviews for a product
  async getByProduct(productId: string, limit: number = 10) {
    return db.review.findMany({
      where: {
        productId,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  },

  // Increment view count
  async incrementViews(id: string) {
    return db.review.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  },
}
