// src/app/api/admin/guides/route.ts
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
    const { title, slug, excerpt, introduction, content, status, featured } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    const guide = await db.guide.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        introduction: introduction || "",
        content,
        status: status || "DRAFT",
        featured: featured || false,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: guide,
      message: "Guide created successfully",
    })
  } catch (error) {
    console.error("Error creating guide:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create guide" },
      { status: 500 }
    )
  }
}
