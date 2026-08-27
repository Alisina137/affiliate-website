// src/services/ai-prompt.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type PromptCreateInput = {
  name: string
  slug: string
  contentType: string
  operation: string
  userPrompt: string
  description?: string
  systemPrompt?: string
  isDefault?: boolean
  metadata?: Prisma.InputJsonValue
  createdBy: string
}

type PromptUpdateInput = Partial<PromptCreateInput>

export const aiPromptService = {
  // Create a new prompt template
  async create(data: PromptCreateInput) {
    // If this is the default prompt, unset other defaults for this content type
    if (data.isDefault) {
      await db.aIPromptTemplate.updateMany({
        where: {
          contentType: data.contentType,
          operation: data.operation,
          isDefault: true,
        },
        data: { isDefault: false },
      })
    }

    return db.aIPromptTemplate.create({
      data: {
        name: data.name,
        slug: data.slug,
        contentType: data.contentType,
        operation: data.operation,
        userPrompt: data.userPrompt,
        description: data.description,
        systemPrompt: data.systemPrompt,
        isDefault: data.isDefault || false,
        metadata: data.metadata,
        createdBy: data.createdBy,
      },
    })
  },

  // Get all prompt templates
  async getAll(params?: {
    contentType?: string
    operation?: string
    isActive?: boolean
    search?: string
    limit?: number
    offset?: number
  }) {
    const {
      contentType,
      operation,
      isActive = true,
      search,
      limit = 20,
      offset = 0,
    } = params || {}

    const where: Prisma.AIPromptTemplateWhereInput = { isActive }

    if (contentType) where.contentType = contentType
    if (operation) where.operation = operation
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.aIPromptTemplate.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { isDefault: "desc" },
          { name: "asc" },
        ],
        skip: offset,
        take: limit,
      }),
      db.aIPromptTemplate.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get a prompt by slug
  async getBySlug(slug: string) {
    return db.aIPromptTemplate.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Get a prompt by ID
  async getById(id: string) {
    return db.aIPromptTemplate.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Get default prompt for content type
  async getDefault(contentType: string, operation: string) {
    return db.aIPromptTemplate.findFirst({
      where: {
        contentType,
        operation,
        isDefault: true,
        isActive: true,
      },
    })
  },

  // Update a prompt
  async update(id: string, data: PromptUpdateInput) {
    // If this is being set as default, unset other defaults
    if (data.isDefault) {
      const current = await db.aIPromptTemplate.findUnique({ where: { id } })
      if (current) {
        await db.aIPromptTemplate.updateMany({
          where: {
            contentType: current.contentType,
            operation: current.operation,
            isDefault: true,
            NOT: { id },
          },
          data: { isDefault: false },
        })
      }
    }

    return db.aIPromptTemplate.update({
      where: { id },
      data,
    })
  },

  // Delete a prompt (soft delete)
  async delete(id: string) {
    return db.aIPromptTemplate.update({
      where: { id },
      data: { isActive: false },
    })
  },

  // Clone a prompt
  async clone(id: string, newName: string, userId: string) {
    const original = await db.aIPromptTemplate.findUnique({
      where: { id },
    })

    if (!original) {
      throw new Error("Prompt not found")
    }

    // Generate slug from name
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    return this.create({
      name: newName,
      slug,
      contentType: original.contentType,
      operation: original.operation,
      userPrompt: original.userPrompt,
      description: original.description || `Clone of ${original.name}`,
      systemPrompt: original.systemPrompt || undefined,
      isDefault: false,
      metadata: original.metadata || undefined,
      createdBy: userId,
    })
  },
}
