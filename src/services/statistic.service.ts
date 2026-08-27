// src/services/statistic.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type StatisticCreateInput = {
  title: string
  slug: string
  authorId: string
  nicheId?: string
  content?: string
  excerpt?: string
  data?: Prisma.InputJsonValue
  sources?: string[]
  methodology?: string
  embedCode?: string
  featured?: boolean
  seoTitle?: string
  metaDescription?: string
  contentBlocks?: Prisma.InputJsonValue
}

type StatisticUpdateInput = Partial<StatisticCreateInput>

export const statisticService = {
  // Get all statistics
  async getAll(params?: {
    nicheId?: string
    status?: string
    featured?: boolean
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      nicheId,
      status,
      featured,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.StatisticWhereInput = {}

    if (nicheId) where.nicheId = nicheId
    if (status) where.status = status
    if (featured !== undefined) where.featured = featured
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.statistic.findMany({
        where,
        include: {
          niche: true,
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
      db.statistic.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a statistic by slug
  async getBySlug(slug: string) {
    return db.statistic.findUnique({
      where: { slug },
      include: {
        niche: true,
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

  // Get a statistic by ID
  async getById(id: string) {
    return db.statistic.findUnique({
      where: { id },
      include: {
        niche: true,
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

  // Create a statistic
  async create(data: StatisticCreateInput) {
    return db.statistic.create({
      data: {
        title: data.title,
        slug: data.slug,
        authorId: data.authorId,
        nicheId: data.nicheId,
        content: data.content,
        excerpt: data.excerpt,
        data: data.data || {},
        sources: data.sources || [],
        methodology: data.methodology,
        embedCode: data.embedCode,
        featured: data.featured || false,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        contentBlocks: data.contentBlocks,
      },
    })
  },

  // Update a statistic
  async update(id: string, data: StatisticUpdateInput) {
    return db.statistic.update({
      where: { id },
      data,
    })
  },

  // Delete a statistic
  async delete(id: string) {
    return db.statistic.delete({
      where: { id },
    })
  },

  // Publish a statistic
  async publish(id: string) {
    return db.statistic.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  },

  // Increment view count
  async incrementViews(id: string) {
    return db.statistic.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  },

  // Generate embed code for a statistic
  async generateEmbedCode(id: string) {
    const statistic = await db.statistic.findUnique({
      where: { id },
    })

    if (!statistic) {
      throw new Error("Statistic not found")
    }

    const embedCode = `<div class="statistic-embed" data-id="${statistic.id}">
  <h3>${statistic.title}</h3>
  <div class="statistic-data">${JSON.stringify(statistic.data)}</div>
  <p class="statistic-source">Source: ${statistic.sources.join(", ")}</p>
  <a href="/statistics/${statistic.slug}">View Full Statistics</a>
</div>`

    return db.statistic.update({
      where: { id },
      data: { embedCode },
    })
  },
}
