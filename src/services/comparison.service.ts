// src/services/comparison.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type ComparisonCreateInput = {
  title: string
  slug: string
  authorId: string
  content?: string
  excerpt?: string
  winner?: string
  winnerExplanation?: string
  featured?: boolean
  seoTitle?: string
  metaDescription?: string
  contentBlocks?: Prisma.InputJsonValue
  products?: {
    productId: string
    strengths?: string[]
    weaknesses?: string[]
    bestFor?: string
    order?: number
  }[]
}

type ComparisonUpdateInput = Partial<ComparisonCreateInput>

export const comparisonService = {
  // Get all comparisons
  async getAll(params?: {
    status?: string
    featured?: boolean
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      status,
      featured,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.ComparisonWhereInput = {}

    if (status) where.status = status
    if (featured !== undefined) where.featured = featured
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.comparison.findMany({
        where,
        include: {
          products: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
            },
            orderBy: { order: "asc" },
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
      db.comparison.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a comparison by slug
  async getBySlug(slug: string) {
    return db.comparison.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
              },
            },
          },
          orderBy: { order: "asc" },
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

  // Get a comparison by ID
  async getById(id: string) {
    return db.comparison.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
          orderBy: { order: "asc" },
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

  // Create a comparison with products
  async create(data: ComparisonCreateInput) {
    const { products, ...comparisonData } = data

    return db.comparison.create({
      data: {
        ...comparisonData,
        products: {
          create: products?.map((p, index) => ({
            productId: p.productId,
            strengths: p.strengths || [],
            weaknesses: p.weaknesses || [],
            bestFor: p.bestFor,
            order: p.order ?? index,
          })) || [],
        },
      },
      include: {
        products: true,
      },
    })
  },

  // Update a comparison
  async update(id: string, data: ComparisonUpdateInput) {
    const { products, ...comparisonData } = data

    if (products) {
      // Delete existing products
      await db.comparisonProduct.deleteMany({
        where: { comparisonId: id },
      })

      // Create new products
      return db.comparison.update({
        where: { id },
        data: {
          ...comparisonData,
          products: {
            create: products.map((p, index) => ({
              productId: p.productId,
              strengths: p.strengths || [],
              weaknesses: p.weaknesses || [],
              bestFor: p.bestFor,
              order: p.order ?? index,
            })),
          },
        },
        include: {
          products: true,
        },
      })
    }

    return db.comparison.update({
      where: { id },
      data: comparisonData,
      include: {
        products: true,
      },
    })
  },

  // Delete a comparison
  async delete(id: string) {
    return db.comparison.delete({
      where: { id },
    })
  },

  // Publish a comparison
  async publish(id: string) {
    return db.comparison.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  },

  // Increment view count
  async incrementViews(id: string) {
    return db.comparison.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  },
}
