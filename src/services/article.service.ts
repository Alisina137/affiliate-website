// src/services/article.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type ArticleCreateInput = {
  title: string
  slug: string
  authorId: string
  categoryId?: string
  content?: string
  excerpt?: string
  featured?: boolean
  seoTitle?: string
  metaDescription?: string
  contentBlocks?: Prisma.InputJsonValue
}

type ArticleUpdateInput = Partial<ArticleCreateInput>

export const articleService = {
  // Get all articles
  async getAll(params?: {
    categoryId?: string
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
      categoryId,
      authorId,
      status,
      featured,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.ArticleWhereInput = {}

    if (categoryId) where.categoryId = categoryId
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
      db.article.findMany({
        where,
        include: {
          category: true,
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
      db.article.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get an article by slug
  async getBySlug(slug: string) {
    return db.article.findUnique({
      where: { slug },
      include: {
        category: true,
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

  // Get an article by ID
  async getById(id: string) {
    return db.article.findUnique({
      where: { id },
      include: {
        category: true,
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

  // Create an article
  async create(data: ArticleCreateInput) {
    return db.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        authorId: data.authorId,
        categoryId: data.categoryId,
        content: data.content,
        excerpt: data.excerpt,
        featured: data.featured || false,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        contentBlocks: data.contentBlocks,
      },
    })
  },

  // Update an article
  async update(id: string, data: ArticleUpdateInput) {
    return db.article.update({
      where: { id },
      data,
    })
  },

  // Delete an article
  async delete(id: string) {
    return db.article.delete({
      where: { id },
    })
  },

  // Publish an article
  async publish(id: string) {
    return db.article.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  },

  // Archive an article
  async archive(id: string) {
    return db.article.update({
      where: { id },
      data: {
        status: "ARCHIVED",
      },
    })
  },

  // Increment view count
  async incrementViews(id: string) {
    return db.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  },
}
