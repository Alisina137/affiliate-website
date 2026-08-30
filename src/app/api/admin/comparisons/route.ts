// src/app/api/admin/comparisons/route.ts
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
    const { title, slug, productA, productB, excerpt, content, winner, winnerExplanation, status, featured } = body

    if (!title || !slug || !productA || !productB || !content) {
      return NextResponse.json(
        { error: "Title, slug, both products, and content are required" },
        { status: 400 }
      )
    }

    // Create the comparison
    const comparison = await db.comparison.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        winner: winner || "",
        winnerExplanation: winnerExplanation || "",
        status: status || "DRAFT",
        featured: featured || false,
        authorId: session.user.id,
      },
    })

    // Add products to the comparison
    await db.comparisonProduct.createMany({
      data: [
        { comparisonId: comparison.id, productId: productA, order: 0 },
        { comparisonId: comparison.id, productId: productB, order: 1 },
      ],
    })

    return NextResponse.json({
      success: true,
      data: comparison,
      message: "Comparison created successfully",
    })
  } catch (error) {
    console.error("Error creating comparison:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create comparison" },
      { status: 500 }
    )
  }
}
