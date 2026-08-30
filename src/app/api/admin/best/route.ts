// src/app/api/admin/best/route.ts
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

    const bestOf = await db.bestOf.create({
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
      data: bestOf,
      message: "Best Of list created successfully",
    })
  } catch (error) {
    console.error("Error creating best-of:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create best-of" },
      { status: 500 }
    )
  }
}
