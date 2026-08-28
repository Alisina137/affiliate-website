// src/services/ai-generation.service.ts

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type AIGenerationCreateInput = {
  userId: string;
  contentType: string;
  contentId?: string;
  operation: string;
  model: string;
  promptVersion?: string;
  input: Prisma.InputJsonValue;
  output?: Prisma.InputJsonValue;
  status?: string;
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  duration?: number;
};

type AIGenerationUpdateInput = Partial<AIGenerationCreateInput>;

type AIGenerationFilters = {
  userId?: string;
  contentType?: string;
  status?: string;
  operation?: string;
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: "createdAt" | "updatedAt" | "status" | "contentType" | "operation";
  sortOrder?: "asc" | "desc";
};

type AIGenerationWhere = {
  userId?: string;
  contentType?: string;
  status?: string;
  operation?: string;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
};

export const aiGenerationService = {
  /**
   * Create a new AI generation record.
   */
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
        status: data.status ?? "PENDING",
        error: data.error,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        estimatedCost: data.estimatedCost,
        duration: data.duration,
      },
    });
  },

  /**
   * Update an existing AI generation record.
   */
  async update(id: string, data: AIGenerationUpdateInput) {
    return db.aIGeneration.update({
      where: { id },
      data: {
        ...(data.userId !== undefined && { userId: data.userId }),
        ...(data.contentType !== undefined && {
          contentType: data.contentType,
        }),
        ...(data.contentId !== undefined && {
          contentId: data.contentId,
        }),
        ...(data.operation !== undefined && {
          operation: data.operation,
        }),
        ...(data.model !== undefined && {
          model: data.model,
        }),
        ...(data.promptVersion !== undefined && {
          promptVersion: data.promptVersion,
        }),
        ...(data.input !== undefined && {
          input: data.input,
        }),
        ...(data.output !== undefined && {
          output: data.output,
        }),
        ...(data.status !== undefined && {
          status: data.status,
        }),
        ...(data.error !== undefined && {
          error: data.error,
        }),
        ...(data.inputTokens !== undefined && {
          inputTokens: data.inputTokens,
        }),
        ...(data.outputTokens !== undefined && {
          outputTokens: data.outputTokens,
        }),
        ...(data.estimatedCost !== undefined && {
          estimatedCost: data.estimatedCost,
        }),
        ...(data.duration !== undefined && {
          duration: data.duration,
        }),
      },
    });
  },

  /**
   * Get a single generation by ID.
   */
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
    });
  },

  /**
   * Get generations with filtering and pagination.
   */
  async getAll(params?: AIGenerationFilters) {
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
    } = params ?? {};

    const safeLimit = Math.max(1, Math.min(limit, 100));
    const safeOffset = Math.max(0, offset);

    const where: AIGenerationWhere = {};

    if (userId) {
      where.userId = userId;
    }

    if (contentType) {
      where.contentType = contentType;
    }

    if (status) {
      where.status = status;
    }

    if (operation) {
      where.operation = operation;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = startDate;
      }

      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

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
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: safeOffset,
        take: safeLimit,
      }),

      db.aIGeneration.count({
        where,
      }),
    ]);

    return {
      data,
      total,
      page: Math.floor(safeOffset / safeLimit) + 1,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  },

  /**
   * Get all generations belonging to a specific content item.
   */
  async getByContent(contentId: string, contentType: string) {
    return db.aIGeneration.findMany({
      where: {
        contentId,
        contentType,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Get AI generation statistics.
   */
  async getStats(params?: {
    userId?: string;
    contentType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { userId, contentType, startDate, endDate } = params ?? {};

    const where: AIGenerationWhere = {};

    if (userId) {
      where.userId = userId;
    }

    if (contentType) {
      where.contentType = contentType;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = startDate;
      }

      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [total, successful, failed, cost] = await Promise.all([
      db.aIGeneration.count({
        where,
      }),

      db.aIGeneration.count({
        where: {
          ...where,
          status: "SUCCESS",
        },
      }),

      db.aIGeneration.count({
        where: {
          ...where,
          status: "FAILED",
        },
      }),

      db.aIGeneration.aggregate({
        where,
        _sum: {
          estimatedCost: true,
        },
      }),
    ]);

    return {
      totalGenerations: total,
      successfulGenerations: successful,
      failedGenerations: failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      totalCost: cost._sum.estimatedCost ?? 0,
    };
  },

  /**
   * Get total successful AI generation cost.
   */
  async getTotalCost(userId?: string) {
    const where: AIGenerationWhere = {
      status: "SUCCESS",
    };

    if (userId) {
      where.userId = userId;
    }

    const result = await db.aIGeneration.aggregate({
      where,
      _sum: {
        estimatedCost: true,
      },
      _count: true,
    });

    return {
      totalCost: result._sum.estimatedCost ?? 0,
      totalGenerations: result._count,
    };
  },
};
