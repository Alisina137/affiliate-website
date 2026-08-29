// src/app/api/admin/ai/publish/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const publishSchema = z.object({
  contentId: z.string(),
  contentType: z.string(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = publishSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { contentId, contentType } = result.data

    let published
    switch (contentType) {
      case "REVIEW":
        published = await db.review.update({
          where: { id: contentId },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        })
        break
      case "COMPARISON":
        published = await db.comparison.update({
          where: { id: contentId },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        })
        break
      case "BEST_OF":
        published = await db.bestOf.update({
          where: { id: contentId },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        })
        break
      case "GUIDE":
        published = await db.guide.update({
          where: { id: contentId },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        })
        break
      default:
        return NextResponse.json(
          { error: `Unsupported content type: ${contentType}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: published,
      message: "Content published successfully",
    })
  } catch (error) {
    console.error("Publish error:", error)
    return NextResponse.json(
      { error: "Failed to publish content" },
      { status: 500 }
    )
  }
}
