// src/services/affiliate-click.service.ts

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const affiliateClickService = {
  // ============================================
  // GET CLICKS FOR A LINK
  // ============================================

  async getByLink(
    linkId: string,
    params?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { limit = 50, offset = 0, startDate, endDate } = params || {};

    const where: Prisma.AffiliateClickWhereInput = {
      affiliateLinkId: linkId,
    };

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      };
    }

    const [data, total] = await Promise.all([
      db.affiliateClick.findMany({
        where,
        include: {
          product: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),

      db.affiliateClick.count({
        where,
      }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // ============================================
  // GET CLICKS FOR A PRODUCT
  // ============================================

  async getByProduct(
    productId: string,
    params?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const { limit = 50, offset = 0, startDate, endDate } = params || {};

    const where: Prisma.AffiliateClickWhereInput = {
      productId,
    };

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      };
    }

    const [data, total] = await Promise.all([
      db.affiliateClick.findMany({
        where,
        include: {
          affiliateLink: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),

      db.affiliateClick.count({
        where,
      }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // ============================================
  // GET CLICK STATISTICS
  // ============================================

  async getStats(params?: {
    startDate?: Date;
    endDate?: Date;
    affiliateLinkId?: string;
    productId?: string;
  }) {
    const { startDate, endDate, affiliateLinkId, productId } = params || {};

    const where: Prisma.AffiliateClickWhereInput = {};

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      };
    }

    if (affiliateLinkId) {
      where.affiliateLinkId = affiliateLinkId;
    }

    if (productId) {
      where.productId = productId;
    }

    const [total, converted, byCountry, byDevice] = await Promise.all([
      // Total clicks
      db.affiliateClick.count({
        where,
      }),

      // Converted clicks
      db.affiliateClick.count({
        where: {
          ...where,
          converted: true,
        },
      }),

      // Clicks by country
      db.affiliateClick.groupBy({
        by: ["country"],
        where,
        _count: true,
        take: 10,
      }),

      // Clicks by device
      db.affiliateClick.groupBy({
        by: ["device"],
        where,
        _count: true,
      }),
    ]);

    /*
     * Prisma versions can differ in their generated typing for
     * groupBy().orderBy._count. Instead of relying on
     * `_count: { _all: "desc" }`, sort the results here.
     */

    const sortedByCountry = [...byCountry].sort((a, b) => b._count - a._count);

    const sortedByDevice = [...byDevice].sort((a, b) => b._count - a._count);

    return {
      totalClicks: total,

      convertedClicks: converted,

      conversionRate: total > 0 ? (converted / total) * 100 : 0,

      byCountry: sortedByCountry.map((item) => ({
        country: item.country || "Unknown",
        count: item._count,
      })),

      byDevice: sortedByDevice.map((item) => ({
        device: item.device || "Unknown",
        count: item._count,
      })),
    };
  },

  // ============================================
  // RECORD A CONVERSION
  // ============================================

  async recordConversion(clickId: string, value?: number) {
    return db.affiliateClick.update({
      where: {
        id: clickId,
      },

      data: {
        converted: true,
        conversionValue: value,
      },
    });
  },

  // ============================================
  // GET DAILY CLICK COUNTS
  // ============================================

  async getDailyStats(days: number = 30, affiliateLinkId?: string) {
    const startDate = new Date();

    startDate.setDate(startDate.getDate() - days);

    const where: Prisma.AffiliateClickWhereInput = {
      createdAt: {
        gte: startDate,
      },
    };

    if (affiliateLinkId) {
      where.affiliateLinkId = affiliateLinkId;
    }

    const clicks = await db.affiliateClick.findMany({
      where,

      select: {
        createdAt: true,
        converted: true,
        conversionValue: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    // ============================================
    // GROUP BY DAY
    // ============================================

    const dailyMap = new Map<
      string,
      {
        clicks: number;
        conversions: number;
        value: number;
      }
    >();

    clicks.forEach((click) => {
      const date = click.createdAt.toISOString().split("T")[0];

      const existing = dailyMap.get(date) || {
        clicks: 0,
        conversions: 0,
        value: 0,
      };

      existing.clicks += 1;

      if (click.converted) {
        existing.conversions += 1;

        if (click.conversionValue != null) {
          existing.value += click.conversionValue;
        }
      }

      dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  },
};
