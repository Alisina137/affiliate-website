// src/app/api/admin/ai/rollback/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const rollbackSchema = z.object({
  generationId: z.string(),
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
    const result = rollbackSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { generationId, contentId, contentType } = result.data

    // Get the generation
    const generation = await db.aIGeneration.findUnique({
      where: { id: generationId },
    })

    if (!generation || !generation.output) {
      return NextResponse.json(
        { error: "Generation not found or has no output" },
        { status: 404 }
      )
    }

    // Determine which table to update based on contentType
    let updatedContent
    const data = generation.output as Record<string, any>

    switch (contentType) {
      case "REVIEW":
        updatedContent = await db.review.update({
          where: { id: contentId },
          data: {
            title: data.title as string,
            content: data.content as string,
            excerpt: data.excerpt as string,
            rating: data.rating as number,
            pros: data.pros as string[],
            cons: data.cons as string[],
            verdict: data.verdict as string,
            bestFor: data.bestFor as string,
            seoTitle: data.seoTitle as string,
            metaDescription: data.metaDescription as string,
          },
        })
        break
      case "COMPARISON":
        updatedContent = await db.comparison.update({
          where: { id: contentId },
          data: {
            title: data.title as string,
            content: data.content as string,
            excerpt: data.excerpt as string,
            winner: data.winner as string,
            winnerExplanation: data.winnerExplanation as string,
            seoTitle: data.seoTitle as string,
            metaDescription: data.metaDescription as string,
          },
        })
        break
      case "BEST_OF":
        updatedContent = await db.bestOf.update({
          where: { id: contentId },
          data: {
            title: data.title as string,
            content: data.content as string,
            excerpt: data.excerpt as string,
            introduction: data.introduction as string,
            seoTitle: data.seoTitle as string,
            metaDescription: data.metaDescription as string,
          },
        })
        break
      case "GUIDE":
        updatedContent = await db.guide.update({
          where: { id: contentId },
          data: {
            title: data.title as string,
            content: data.content as string,
            excerpt: data.excerpt as string,
            introduction: data.introduction as string,
            seoTitle: data.seoTitle as string,
            metaDescription: data.metaDescription as string,
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
      data: updatedContent,
      message: "Successfully rolled back to previous version",
    })
  } catch (error) {
    console.error("Rollback error:", error)
    return NextResponse.json(
      { error: "Failed to rollback" },
      { status: 500 }
    )
  }
}
