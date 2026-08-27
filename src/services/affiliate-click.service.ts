// src/services/affiliate-click.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type ClickCreateInput = {
  affiliateLinkId: string
  productId?: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  referer?: string
  country?: string
  device?: string
}

export const affiliateClickService = {
  // Get clicks for a link
  async getByLink(linkId: string, params?: {
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
  }) {
    const {
      limit = 50,
      offset = 0,
      startDate,
      endDate,
    } = params || {}

    const where: Prisma.AffiliateClickWhereInput = {
      affiliateLinkId: linkId,
    }

    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

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
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      db.affiliateClick.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get clicks for a product
  async getByProduct(productId: string, params?: {
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
  }) {
    const {
      limit = 50,
      offset = 0,
      startDate,
      endDate,
    } = params || {}

    const where: Prisma.AffiliateClickWhereInput = {
      productId,
    }

    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }

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
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      db.affiliateClick.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get click statistics
  async getStats(params?: {
    startDate?: Date
    endDate?: Date
    affiliateLinkId?: string
    productId?: string
  }) {
    const { startDate, endDate, affiliateLinkId, productId } = params || {}

    const where: Prisma.AffiliateClickWhereInput = {}

    if (startDate) where.createdAt = { gte: startDate }
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate }
    if (affiliateLinkId) where.affiliateLinkId = affiliateLinkId
    if (productId) where.productId = productId

    const [total, converted, byCountry, byDevice] = await Promise.all([
      db.affiliateClick.count({ where }),
      db.affiliateClick.count({ where: { ...where, converted: true } }),
      db.affiliateClick.groupBy({
        by: ["country"],
        where,
        _count: true,
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),
      db.affiliateClick.groupBy({
        by: ["device"],
        where,
        _count: true,
      }),
    ])

    return {
      totalClicks: total,
      convertedClicks: converted,
      conversionRate: total > 0 ? (converted / total) * 100 : 0,
      byCountry: byCountry.map((c) => ({
        country: c.country || "Unknown",
        count: c._count,
      })),
      byDevice: byDevice.map((d) => ({
        device: d.device || "Unknown",
        count: d._count,
      })),
    }
  },

  // Record a conversion
  async recordConversion(clickId: string, value?: number) {
    return db.affiliateClick.update({
      where: { id: clickId },
      data: {
        converted: true,
        conversionValue: value,
      },
    })
  },

  // Get daily click counts for a date range
  async getDailyStats(days: number = 30, affiliateLinkId?: string) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where: Prisma.AffiliateClickWhereInput = {
      createdAt: { gte: startDate },
    }
    if (affiliateLinkId) where.affiliateLinkId = affiliateLinkId

    const clicks = await db.affiliateClick.findMany({
      where,
      select: {
        createdAt: true,
        converted: true,
        conversionValue: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Group by day
    const dailyMap = new Map<string, { clicks: number; conversions: number; value: number }>()
    
    clicks.forEach((click) => {
      const date = click.createdAt.toISOString().split("T")[0]
      const existing = dailyMap.get(date) || { clicks: 0, conversions: 0, value: 0 }
      existing.clicks++
      if (click.converted) {
        existing.conversions++
        if (click.conversionValue) existing.value += click.conversionValue
      }
      dailyMap.set(date, existing)
    })

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }))
  },
}
