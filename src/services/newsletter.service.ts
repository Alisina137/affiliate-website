// src/services/newsletter.service.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

export const newsletterService = {
  // Subscribe a user
  async subscribe(email: string, name?: string, source?: string) {
    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isActive) {
        return { success: false, message: "This email is already subscribed" }
      } else {
        // Reactivate
        await db.subscriber.update({
          where: { email },
          data: { isActive: true },
        })
        return { success: true, message: "Successfully resubscribed!" }
      }
    }

    // Create new subscriber
    await db.subscriber.create({
      data: {
        email,
        name: name || null,
        source: source || "website",
      },
    })

    return { success: true, message: "Successfully subscribed!" }
  },

  // Unsubscribe a user
  async unsubscribe(email: string) {
    const subscriber = await db.subscriber.findUnique({
      where: { email },
    })

    if (!subscriber) {
      return { success: false, message: "Email not found" }
    }

    await db.subscriber.update({
      where: { email },
      data: { isActive: false },
    })

    return { success: true, message: "Successfully unsubscribed" }
  },

  // Get all subscribers
  async getAll(params?: {
    isActive?: boolean
    limit?: number
    offset?: number
    search?: string
  }) {
    const {
      isActive = true,
      limit = 20,
      offset = 0,
      search,
    } = params || {}

    // Use proper Prisma type instead of any
    const where: Prisma.SubscriberWhereInput = {}
    if (isActive !== undefined) where.isActive = isActive
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.subscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      db.subscriber.count({ where }),
    ])

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get subscriber count
  async getCount() {
    const [total, active] = await Promise.all([
      db.subscriber.count(),
      db.subscriber.count({ where: { isActive: true } }),
    ])

    return { total, active }
  },
}
