// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all stats in parallel
    const [
      totalProducts,
      totalReviews,
      totalComparisons,
      totalGuides,
      totalAffiliateLinks,
      totalAffiliateClicks,
      totalSubscribers,
      totalViews,
    ] = await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.review.count({ where: { status: "PUBLISHED" } }),
      db.comparison.count({ where: { status: "PUBLISHED" } }),
      db.guide.count({ where: { status: "PUBLISHED" } }),
      db.affiliateLink.count({ where: { isActive: true } }),
      db.affiliateLink.aggregate({ _sum: { clicks: true } }),
      db.subscriber.count({ where: { isActive: true } }),
      db.review.aggregate({ _sum: { views: true } }),
    ])

    // Get additional stats
    const totalBestOf = await db.bestOf.count({ where: { status: "PUBLISHED" } })
    const totalStatistics = await db.statistic.count({ where: { status: "PUBLISHED" } })

    return NextResponse.json({
      totalProducts,
      totalReviews,
      totalComparisons,
      totalGuides,
      totalAffiliateLinks,
      totalAffiliateClicks: totalAffiliateClicks._sum.clicks || 0,
      totalSubscribers,
      totalViews: totalViews._sum.views || 0,
      totalBestOf,
      totalStatistics,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
