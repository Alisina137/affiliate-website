// src/app/api/admin/analytics/daily/route.ts
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

    // Pass the days parameter to the service
    const dailyStats = await analyticsService.getDailyStats(days)

    return NextResponse.json(dailyStats)
  } catch (error) {
    console.error("Error fetching daily stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily stats" },
      { status: 500 }
    )
  }
}
