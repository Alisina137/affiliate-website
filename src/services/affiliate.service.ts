// src/services/affiliate.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

type AffiliateLinkCreateInput = {
  url: string
  productId: string
  merchant: string
  merchantId?: string
  label?: string
  trackingUrl?: string
  country?: string
  priority?: number
}

type AffiliateLinkUpdateInput = Partial<AffiliateLinkCreateInput>

export const affiliateService = {
  // Get affiliate links for a product
  async getByProduct(productId: string, country?: string) {
    const where: Prisma.AffiliateLinkWhereInput = {
      productId,
      isActive: true,
    }
    if (country) where.country = country

    return db.affiliateLink.findMany({
      where,
      orderBy: { priority: "desc" },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    })
  },

  // Get the best affiliate link (highest priority) for a product
  async getBestLink(productId: string, country?: string) {
    const where: Prisma.AffiliateLinkWhereInput = {
      productId,
      isActive: true,
    }
    if (country) where.country = country

    return db.affiliateLink.findFirst({
      where,
      orderBy: { priority: "desc" },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    })
  },

  // Get all affiliate links with filtering
  async getAll(params?: {
    productId?: string
    merchantId?: string
    country?: string
    isActive?: boolean
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const {
      productId,
      merchantId,
      country,
      isActive = true,
      search,
      limit = 20,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {}

    const where: Prisma.AffiliateLinkWhereInput = { isActive }

    if (productId) where.productId = productId
    if (merchantId) where.merchantId = merchantId
    if (country) where.country = country
    if (search) {
      where.OR = [
        { merchant: { contains: search, mode: "insensitive" } },
        { label: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.affiliateLink.findMany({
        where,
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.affiliateLink.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get an affiliate link by ID
  async getById(id: string) {
    return db.affiliateLink.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    })
  },

  // Create an affiliate link
  async create(data: AffiliateLinkCreateInput) {
    return db.affiliateLink.create({
      data: {
        url: data.url,
        productId: data.productId,
        merchant: data.merchant,
        merchantId: data.merchantId,
        label: data.label || "Check Price",
        trackingUrl: data.trackingUrl,
        country: data.country || "US",
        priority: data.priority || 0,
      },
    })
  },

  // Update an affiliate link
  async update(id: string, data: AffiliateLinkUpdateInput) {
    return db.affiliateLink.update({
      where: { id },
      data,
    })
  },

  // Delete an affiliate link (soft delete)
  async delete(id: string) {
    return db.affiliateLink.update({
      where: { id },
      data: { isActive: false },
    })
  },

  // Track a click on an affiliate link
  async trackClick(id: string, data?: {
    userId?: string
    ipAddress?: string
    userAgent?: string
    referer?: string
    country?: string
    device?: string
  }) {
    const [click, updatedLink] = await Promise.all([
      db.affiliateClick.create({
        data: {
          affiliateLinkId: id,
          productId: data?.userId ? undefined : undefined,
          userId: data?.userId,
          ipAddress: data?.ipAddress,
          userAgent: data?.userAgent,
          referer: data?.referer,
          country: data?.country,
          device: data?.device,
        },
      }),
      db.affiliateLink.update({
        where: { id },
        data: {
          clicks: { increment: 1 },
          lastClicked: new Date(),
        },
      }),
    ])

    return { click, link: updatedLink }
  },

  // Get click statistics for a link
  async getClickStats(linkId: string) {
    const [totalClicks, todayClicks, weekClicks, monthClicks] = await Promise.all([
      db.affiliateClick.count({
        where: { affiliateLinkId: linkId },
      }),
      db.affiliateClick.count({
        where: {
          affiliateLinkId: linkId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.affiliateClick.count({
        where: {
          affiliateLinkId: linkId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      db.affiliateClick.count({
        where: {
          affiliateLinkId: linkId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ])

    return {
      totalClicks,
      todayClicks,
      weekClicks,
      monthClicks,
    }
  },

  // Get top performing affiliate links
  async getTopPerforming(limit: number = 10) {
    return db.affiliateLink.findMany({
      where: { isActive: true },
      orderBy: { clicks: "desc" },
      take: limit,
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    })
  },
}
