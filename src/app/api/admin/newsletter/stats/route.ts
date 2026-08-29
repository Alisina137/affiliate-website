// src/app/api/admin/newsletter/stats/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { newsletterService } from "@/services/newsletter.service"

export async function GET() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await newsletterService.getCount()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching newsletter stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
