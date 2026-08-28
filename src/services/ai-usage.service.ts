// src/services/ai-usage.service.ts

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// ============================================
// TYPES
// ============================================

type AIUsageCreateInput = {
  userId: string;
  contentType: string;
  operation: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  duration: number;
  generationId?: string;
};

type AIUsageDateFilter = {
  gte?: Date;
  lte?: Date;
};

// ============================================
// AI USAGE SERVICE
// ============================================

export const aiUsageService = {
  // ==========================================
  // Record AI usage
  // ==========================================

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
    });
  },

  // ==========================================
  // Get usage stats for a user
  // ==========================================

  async getUserStats(
    userId: string,
    params?: {
      startDate?: Date;
      endDate?: Date;
      contentType?: string;
    },
  ) {
    const { startDate, endDate, contentType } = params ?? {};

    const createdAt: AIUsageDateFilter = {};

    if (startDate) {
      createdAt.gte = startDate;
    }

    if (endDate) {
      createdAt.lte = endDate;
    }

    const where: Prisma.AIUsageWhereInput = {
      userId,
      ...(contentType ? { contentType } : {}),
      ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
    };

    const [total, byContentType, byOperation, byModel] = await Promise.all([
      // --------------------------------------
      // Total usage
      // --------------------------------------

      db.aIUsage.aggregate({
        where,
        _sum: {
          inputTokens: true,
          outputTokens: true,
          cost: true,
        },
        _count: {
          _all: true,
        },
      }),

      // --------------------------------------
      // Usage by content type
      // --------------------------------------

      db.aIUsage.groupBy({
        by: ["contentType"],
        where,
        _sum: {
          cost: true,
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _sum: {
            cost: "desc",
          },
        },
      }),

      // --------------------------------------
      // Usage by operation
      // --------------------------------------

      db.aIUsage.groupBy({
        by: ["operation"],
        where,
        _sum: {
          cost: true,
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _sum: {
            cost: "desc",
          },
        },
      }),

      // --------------------------------------
      // Usage by model
      // --------------------------------------

      db.aIUsage.groupBy({
        by: ["model"],
        where,
        _sum: {
          cost: true,
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _sum: {
            cost: "desc",
          },
        },
      }),
    ]);

    return {
      totalRequests: total._count._all,

      totalInputTokens: total._sum.inputTokens ?? 0,

      totalOutputTokens: total._sum.outputTokens ?? 0,

      totalCost: total._sum.cost ?? 0,

      byContentType: byContentType.map((item) => ({
        contentType: item.contentType,
        count: item._count._all,
        cost: item._sum.cost ?? 0,
      })),

      byOperation: byOperation.map((item) => ({
        operation: item.operation,
        count: item._count._all,
        cost: item._sum.cost ?? 0,
      })),

      byModel: byModel.map((item) => ({
        model: item.model,
        count: item._count._all,
        cost: item._sum.cost ?? 0,
      })),
    };
  },

  // ==========================================
  // Get total usage across all users
  // ==========================================

  async getTotalStats(params?: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = params ?? {};

    const createdAt: AIUsageDateFilter = {};

    if (startDate) {
      createdAt.gte = startDate;
    }

    if (endDate) {
      createdAt.lte = endDate;
    }

    const where: Prisma.AIUsageWhereInput =
      Object.keys(createdAt).length > 0 ? { createdAt } : {};

    const [total, byUser] = await Promise.all([
      // --------------------------------------
      // Total usage
      // --------------------------------------

      db.aIUsage.aggregate({
        where,
        _sum: {
          inputTokens: true,
          outputTokens: true,
          cost: true,
        },
        _count: {
          _all: true,
        },
      }),

      // --------------------------------------
      // Top users
      // --------------------------------------

      db.aIUsage.groupBy({
        by: ["userId"],
        where,
        _sum: {
          cost: true,
        },
        _count: {
          _all: true,
        },
        orderBy: {
          _sum: {
            cost: "desc",
          },
        },
        take: 10,
      }),
    ]);

    return {
      totalRequests: total._count._all,

      totalInputTokens: total._sum.inputTokens ?? 0,

      totalOutputTokens: total._sum.outputTokens ?? 0,

      totalCost: total._sum.cost ?? 0,

      topUsers: byUser.map((item) => ({
        userId: item.userId,
        count: item._count._all,
        cost: item._sum.cost ?? 0,
      })),
    };
  },

  // ==========================================
  // Get daily usage for charts
  // ==========================================

  async getDailyStats(days = 30, userId?: string) {
    // Prevent invalid values such as 0 or negative numbers.
    const safeDays = Math.max(1, Math.floor(days));

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - safeDays);

    const where: Prisma.AIUsageWhereInput = {
      createdAt: {
        gte: startDate,
      },
      ...(userId ? { userId } : {}),
    };

    const usage = await db.aIUsage.findMany({
      where,
      select: {
        createdAt: true,
        cost: true,
        inputTokens: true,
        outputTokens: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // --------------------------------------
    // Group usage by calendar day
    // --------------------------------------

    const dailyMap = new Map<
      string,
      {
        requests: number;
        cost: number;
        tokens: number;
      }
    >();

    usage.forEach((record) => {
      const date = record.createdAt.toISOString().split("T")[0];

      const existing = dailyMap.get(date) ?? {
        requests: 0,
        cost: 0,
        tokens: 0,
      };

      existing.requests += 1;

      existing.cost += record.cost ?? 0;

      existing.tokens += (record.inputTokens ?? 0) + (record.outputTokens ?? 0);

      dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      requests: data.requests,
      cost: data.cost,
      tokens: data.tokens,
    }));
  },
};
