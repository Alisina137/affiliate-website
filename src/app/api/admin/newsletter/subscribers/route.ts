// src/app/api/admin/newsletter/subscribers/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { newsletterService } from "@/services/newsletter.service"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || undefined
    const isActive = searchParams.get("isActive") !== null 
      ? searchParams.get("isActive") === "true" 
      : undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const result = await newsletterService.getAll({
      isActive,
      search,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}
