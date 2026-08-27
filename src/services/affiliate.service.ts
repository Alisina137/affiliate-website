// src/services/affiliate.service.ts
import { db } from "@/lib/db"
import type { AffiliateLink } from "@prisma/client"

type CreateAffiliateInput = {
  url: string
  productId: string
  merchant: string
  label?: string
  trackingUrl?: string
  country?: string
  priority?: number
}

export const affiliateService = {
  // Get affiliate links for a product
  async getByProduct(productId: string) {
    return db.affiliateLink.findMany({
      where: {
        productId,
        isActive: true,
      },
      orderBy: { priority: "desc" },
    })
  },

  // Get the best affiliate link (highest priority) for a product
  async getBestLink(productId: string, country?: string) {
    const where: { productId: string; isActive: boolean; country?: string } = {
      productId,
      isActive: true,
    }
    if (country) where.country = country

    return db.affiliateLink.findFirst({
      where,
      orderBy: { priority: "desc" },
    })
  },

  // Create an affiliate link
  async create(data: CreateAffiliateInput) {
    return db.affiliateLink.create({
      data: {
        url: data.url,
        productId: data.productId,
        merchant: data.merchant,
        label: data.label || "Check Price",
        trackingUrl: data.trackingUrl,
        country: data.country || "US",
        priority: data.priority || 0,
      },
    })
  },

  // Track a click on an affiliate link
  async trackClick(id: string) {
    return db.affiliateLink.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    })
  },

  // Update an affiliate link
  async update(id: string, data: Partial<AffiliateLink>) {
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
}
