// src/app/api/admin/statistics/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, data, sources, methodology, status, featured } = body

    if (!title || !slug || !content || !data) {
      return NextResponse.json(
        { error: "Title, slug, content, and data are required" },
        { status: 400 }
      )
    }

    const statistic = await db.statistic.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        data: data || {},
        sources: sources || [],
        methodology: methodology || "",
        status: status || "DRAFT",
        featured: featured || false,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: statistic,
      message: "Statistics created successfully",
    })
  } catch (error) {
    console.error("Error creating statistics:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create statistics" },
      { status: 500 }
    )
  }
}
