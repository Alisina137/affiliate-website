// src/app/api/admin/articles/route.ts
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
    const { title, slug, excerpt, content, status, featured } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        status: status || "DRAFT",
        featured: featured || false,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: article,
      message: "Article created successfully",
    })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create article" },
      { status: 500 }
    )
  }
}
