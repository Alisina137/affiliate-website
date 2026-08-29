// src/app/api/admin/ai/generations/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get("contentId")
    const contentType = searchParams.get("contentType")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {}
    if (contentId) where.contentId = contentId
    if (contentType) where.contentType = contentType

    const [generations, total] = await Promise.all([
      db.aIGeneration.findMany({
        where,
        include: {
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
      db.aIGeneration.count({ where }),
    ])

    // Calculate total cost
    const costResult = await db.aIGeneration.aggregate({
      where: { ...where, status: "SUCCESS" },
      _sum: { estimatedCost: true },
    })

    return NextResponse.json({
      data: generations,
      total,
      totalCost: costResult._sum.estimatedCost || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching generations:", error)
    return NextResponse.json(
      { error: "Failed to fetch generations" },
      { status: 500 }
    )
  }
}
