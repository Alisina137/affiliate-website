// src/services/bestof.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type BestOfCreateInput = {
  title: string
  slug: string
  authorId: string
  categoryId?: string
  content?: string
  excerpt?: string
  introduction?: string
  featured?: boolean
  seoTitle?: string
  metaDescription?: string
  contentBlocks?: Prisma.InputJsonValue
  entries?: {
    productId: string
    bestFor?: string
    summary?: string
    pros?: string[]
    cons?: string[]
    order?: number
  }[]
}

type BestOfUpdateInput = Partial<BestOfCreateInput>

export const bestOfService = {
  // Get all best-of lists
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

    const where: Prisma.BestOfWhereInput = {}

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
      db.bestOf.findMany({
        where,
        include: {
          category: true,
          entries: {
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
      db.bestOf.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a best-of list by slug
  async getBySlug(slug: string) {
    return db.bestOf.findUnique({
      where: { slug },
      include: {
        category: true,
        entries: {
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

  // Get a best-of list by ID
  async getById(id: string) {
    return db.bestOf.findUnique({
      where: { id },
      include: {
        category: true,
        entries: {
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

  // Create a best-of list with entries
  async create(data: BestOfCreateInput) {
    const { entries, ...bestOfData } = data

    return db.bestOf.create({
      data: {
        ...bestOfData,
        entries: {
          create: entries?.map((e, index) => ({
            productId: e.productId,
            bestFor: e.bestFor,
            summary: e.summary,
            pros: e.pros || [],
            cons: e.cons || [],
            order: e.order ?? index,
          })) || [],
        },
      },
      include: {
        entries: true,
      },
    })
  },

  // Update a best-of list
  async update(id: string, data: BestOfUpdateInput) {
    const { entries, ...bestOfData } = data

    if (entries) {
      // Delete existing entries
      await db.bestOfEntry.deleteMany({
        where: { bestOfId: id },
      })

      // Create new entries
      return db.bestOf.update({
        where: { id },
        data: {
          ...bestOfData,
          entries: {
            create: entries.map((e, index) => ({
              productId: e.productId,
              bestFor: e.bestFor,
              summary: e.summary,
              pros: e.pros || [],
              cons: e.cons || [],
              order: e.order ?? index,
            })),
          },
        },
        include: {
          entries: true,
        },
      })
    }

    return db.bestOf.update({
      where: { id },
      data: bestOfData,
      include: {
        entries: true,
      },
    })
  },

  // Delete a best-of list
  async delete(id: string) {
    return db.bestOf.delete({
      where: { id },
    })
  },

  // Publish a best-of list
  async publish(id: string) {
    return db.bestOf.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  },

  // Increment view count
  async incrementViews(id: string) {
    return db.bestOf.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  },
}
