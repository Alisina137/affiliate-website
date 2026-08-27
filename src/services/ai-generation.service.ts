// src/services/ai-generation.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type AIGenerationCreateInput = {
  userId: string
  contentType: string
  contentId?: string
  operation: string
  model: string
  promptVersion?: string
  input: Prisma.InputJsonValue
  output?: Prisma.InputJsonValue
  status?: string
  error?: string
  inputTokens?: number
  outputTokens?: number
  estimatedCost?: number
  duration?: number
}

type AIGenerationUpdateInput = Partial<AIGenerationCreateInput>

export const aiGenerationService = {
  // Create a new generation record
  async create(data: AIGenerationCreateInput) {
    return db.aIGeneration.create({
      data: {
        userId: data.userId,
        contentType: data.contentType,
        contentId: data.contentId,
        operation: data.operation,
        model: data.model,
        promptVersion: data.promptVersion,
        input: data.input,
        output: data.output,
        status: data.status || "PENDING",
        error: data.error,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        estimatedCost: data.estimatedCost,
        duration: data.duration,
      },
    })
  },

  // Update a generation record
  async update(id: string, data: AIGenerationUpdateInput) {
    return db.aIGeneration.update({
      where: { id },
      data,
    })
  },

  // Get a generation by ID
  async getById(id: string) {
    return db.aIGeneration.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Get all generations with filtering
  async getAll(params?: {
    userId?: string
    contentType?: string
    status?: string
    operation?: string
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      userId,
      contentType,
      status,
      operation,
      limit = 20,
      offset = 0,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.AIGenerationWhereInput = {}

    if (userId) where.userId = userId
    if (contentType) where.contentType = contentType
    if (status) where.status = status
    if (operation) where.operation = operation
    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

    const [data, total] = await Promise.all([
      db.aIGeneration.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.aIGeneration.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get generations by content
  async getByContent(contentId: string, contentType: string) {
    return db.aIGeneration.findMany({
      where: {
        contentId,
        contentType,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Get generation statistics
  async getStats(params?: {
    userId?: string
    contentType?: string
    startDate?: Date
    endDate?: Date
  }) {
    const { userId, contentType, startDate, endDate } = params || {}

    const where: Prisma.AIGenerationWhereInput = {}

    if (userId) where.userId = userId
    if (contentType) where.contentType = contentType
    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

    const [total, successful, failed, cost] = await Promise.all([
      db.aIGeneration.count({ where }),
      db.aIGeneration.count({ where: { ...where, status: "SUCCESS" } }),
      db.aIGeneration.count({ where: { ...where, status: "FAILED" } }),
      db.aIGeneration.aggregate({
        where,
        _sum: { estimatedCost: true },
      }),
    ])

    return {
      totalGenerations: total,
      successfulGenerations: successful,
      failedGenerations: failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      totalCost: cost._sum.estimatedCost || 0,
    }
  },

  // Get total AI cost
  async getTotalCost(userId?: string) {
    const where: Prisma.AIGenerationWhereInput = {
      status: "SUCCESS",
    }
    if (userId) where.userId = userId

    const result = await db.aIGeneration.aggregate({
      where,
      _sum: { estimatedCost: true },
      _count: true,
    })

    return {
      totalCost: result._sum.estimatedCost || 0,
      totalGenerations: result._count,
    }
  },
}
