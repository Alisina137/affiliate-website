// src/app/api/admin/analytics/affiliate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { analyticsService } from "@/services/analytics.service"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get("days") || "30")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Pass the startDate to the service
    const performance = await analyticsService.getAffiliatePerformance(startDate)

    return NextResponse.json(performance)
  } catch (error) {
    console.error("Error fetching affiliate performance:", error)
    return NextResponse.json(
      { error: "Failed to fetch affiliate performance" },
      { status: 500 }
    )
  }
}
