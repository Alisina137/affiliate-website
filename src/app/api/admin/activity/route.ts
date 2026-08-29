// src/app/api/admin/activity/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent reviews
    const recentReviews = await db.review.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
      },
    })

    // Get recent products
    const recentProducts = await db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    })

    // Get recent subscribers
    const recentSubscribers = await db.subscriber.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    // Get recent affiliate clicks
    const recentClicks = await db.affiliateLink.findMany({
      where: { lastClicked: { not: null } },
      orderBy: { lastClicked: "desc" },
      take: 2,
      select: {
        id: true,
        merchant: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        lastClicked: true,
      },
    })

    // Combine and format activities
    const activities = [
      ...recentReviews.map((r) => ({
        id: `review-${r.id}`,
        type: "review" as const,
        action: "published" as const,
        title: r.title,
        url: `/reviews/${r.slug}`,
        timestamp: r.publishedAt || new Date(),
      })),
      ...recentProducts.map((p) => ({
        id: `product-${p.id}`,
        type: "product" as const,
        action: "created" as const,
        title: p.name,
        url: `/products/${p.slug}`,
        timestamp: p.createdAt,
      })),
      ...recentSubscribers.map((s) => ({
        id: `subscriber-${s.id}`,
        type: "subscriber" as const,
        action: "subscribed" as const,
        title: s.email,
        url: undefined,
        timestamp: s.createdAt,
      })),
      ...recentClicks.map((c) => ({
        id: `click-${c.id}`,
        type: "affiliate" as const,
        action: "clicked" as const,
        title: `${c.merchant} - ${c.product?.name || "Product"}`,
        url: c.product ? `/products/${c.product.slug}` : undefined,
        timestamp: c.lastClicked || new Date(),
      })),
    ]

    // Sort by timestamp (newest first) and limit to 10
    const sorted = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json(sorted)
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
}
