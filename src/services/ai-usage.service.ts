// src/services/ai-usage.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type AIUsageCreateInput = {
  userId: string
  contentType: string
  operation: string
  model: string
  inputTokens: number
  outputTokens: number
  cost: number
  duration: number
  generationId?: string
}

export const aiUsageService = {
  // Record AI usage
  async record(data: AIUsageCreateInput) {
    return db.aIUsage.create({
      data: {
        userId: data.userId,
        contentType: data.contentType,
        operation: data.operation,
        model: data.model,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        cost: data.cost,
        duration: data.duration,
        generationId: data.generationId,
      },
    })
  },

  // Get usage stats for a user
  async getUserStats(
    userId: string,
    params?: {
      startDate?: Date
      endDate?: Date
      contentType?: string
    }
  ) {
    const { startDate, endDate, contentType } = params || {}

    const where: Prisma.AIUsageWhereInput = { userId }

    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }
    if (contentType) where.contentType = contentType

    const [total, byContentType, byOperation, byModel] = await Promise.all([
      db.aIUsage.aggregate({
        where,
        _sum: {
          inputTokens: true,
          outputTokens: true,
          cost: true,
        },
        _count: true,
      }),
      db.aIUsage.groupBy({
        by: ["contentType"],
        where,
        _sum: { cost: true },
        _count: true,
        orderBy: { _sum: { cost: "desc" } },
      }),
      db.aIUsage.groupBy({
        by: ["operation"],
        where,
        _sum: { cost: true },
        _count: true,
        orderBy: { _sum: { cost: "desc" } },
      }),
      db.aIUsage.groupBy({
        by: ["model"],
        where,
        _sum: { cost: true },
        _count: true,
        orderBy: { _sum: { cost: "desc" } },
      }),
    ])

    return {
      totalRequests: total._count,
      totalInputTokens: total._sum.inputTokens || 0,
      totalOutputTokens: total._sum.outputTokens || 0,
      totalCost: total._sum.cost || 0,
      byContentType: byContentType.map((c) => ({
        contentType: c.contentType,
        count: c._count,
        cost: c._sum.cost || 0,
      })),
      byOperation: byOperation.map((o) => ({
        operation: o.operation,
        count: o._count,
        cost: o._sum.cost || 0,
      })),
      byModel: byModel.map((m) => ({
        model: m.model,
        count: m._count,
        cost: m._sum.cost || 0,
      })),
    }
  },

  // Get total usage across all users
  async getTotalStats(params?: {
    startDate?: Date
    endDate?: Date
  }) {
    const { startDate, endDate } = params || {}

    const where: Prisma.AIUsageWhereInput = {}

    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

    const [total, byUser] = await Promise.all([
      db.aIUsage.aggregate({
        where,
        _sum: {
          inputTokens: true,
          outputTokens: true,
          cost: true,
        },
        _count: true,
      }),
      db.aIUsage.groupBy({
        by: ["userId"],
        where,
        _sum: { cost: true },
        _count: true,
        orderBy: { _sum: { cost: "desc" } },
        take: 10,
      }),
    ])

    return {
      totalRequests: total._count,
      totalInputTokens: total._sum.inputTokens || 0,
      totalOutputTokens: total._sum.outputTokens || 0,
      totalCost: total._sum.cost || 0,
      topUsers: byUser.map((u) => ({
        userId: u.userId,
        count: u._count,
        cost: u._sum.cost || 0,
      })),
    }
  },

  // Get daily usage for chart
  async getDailyStats(days: number = 30, userId?: string) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: Prisma.AIUsageWhereInput = {
      createdAt: { gte: startDate },
    }
    if (userId) where.userId = userId

    const usage = await db.aIUsage.findMany({
      where,
      select: {
        createdAt: true,
        cost: true,
        inputTokens: true,
        outputTokens: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Group by day
    const dailyMap = new Map<string, { requests: number; cost: number; tokens: number }>()
    
    usage.forEach((record) => {
      const date = record.createdAt.toISOString().split("T")[0]
      const existing = dailyMap.get(date) || { requests: 0, cost: 0, tokens: 0 }
      existing.requests++
      existing.cost += record.cost || 0
      existing.tokens += (record.inputTokens || 0) + (record.outputTokens || 0)
      dailyMap.set(date, existing)
    })

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }))
  },
}
