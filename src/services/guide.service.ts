// src/services/guide.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type GuideCreateInput = {
  title: string
  slug: string
  authorId: string
  categoryId?: string
  content?: string
  excerpt?: string
  introduction?: string
  tableOfContents?: Prisma.InputJsonValue
  featured?: boolean
  seoTitle?: string
  metaDescription?: string
  contentBlocks?: Prisma.InputJsonValue
  guideProducts?: {
    productId: string
    context?: string
    order?: number
  }[]
}

type GuideUpdateInput = Partial<GuideCreateInput>

export const guideService = {
  // Get all guides
  async getAll(params?: {
    categoryId?: string
    status?: string
    featured?: boolean
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      categoryId,
      status,
      featured,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.GuideWhereInput = {}

    if (categoryId) where.categoryId = categoryId
    if (status) where.status = status
    if (featured !== undefined) where.featured = featured
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.guide.findMany({
        where,
        include: {
          category: true,
          guideProducts: {
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
      db.guide.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a guide by slug
  async getBySlug(slug: string) {
    return db.guide.findUnique({
      where: { slug },
      include: {
        category: true,
        guideProducts: {
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

  // Get a guide by ID
  async getById(id: string) {
    return db.guide.findUnique({
      where: { id },
      include: {
        category: true,
        guideProducts: {
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

  // Create a guide with products
  async create(data: GuideCreateInput) {
    const { guideProducts, ...guideData } = data

    return db.guide.create({
      data: {
        ...guideData,
        guideProducts: {
          create: guideProducts?.map((p, index) => ({
            productId: p.productId,
            context: p.context,
            order: p.order ?? index,
          })) || [],
        },
      },
      include: {
        guideProducts: true,
      },
    })
  },

  // Update a guide
  async update(id: string, data: GuideUpdateInput) {
    const { guideProducts, ...guideData } = data

    if (guideProducts) {
      // Delete existing guide products
      await db.guideProduct.deleteMany({
        where: { guideId: id },
      })

      // Create new guide products
      return db.guide.update({
        where: { id },
        data: {
          ...guideData,
          guideProducts: {
            create: guideProducts.map((p, index) => ({
              productId: p.productId,
              context: p.context,
              order: p.order ?? index,
            })),
          },
        },
        include: {
          guideProducts: true,
        },
      })
    }

    return db.guide.update({
      where: { id },
      data: guideData,
      include: {
        guideProducts: true,
      },
    })
  },

  // Delete a guide
  async delete(id: string) {
    return db.guide.delete({
      where: { id },
    })
  },

  // Publish a guide
  async publish(id: string) {
    return db.guide.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  },

  // Increment view count
  async incrementViews(id: string) {
    return db.guide.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  },
}
