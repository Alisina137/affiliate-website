// src/app/api/admin/reviews/route.ts
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
    const { title, slug, productId, excerpt, content, rating, pros, cons, verdict, bestFor, status, featured } = body

    if (!title || !slug || !productId || !content) {
      return NextResponse.json(
        { error: "Title, slug, product, and content are required" },
        { status: 400 }
      )
    }

    // Check if the product actually exists in the database
    const product = await db.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: `Product with ID "${productId}" does not exist. Please select a valid product.` },
        { status: 404 }
      )
    }

    const review = await db.review.create({
      data: {
        title,
        slug,
        productId,
        excerpt: excerpt || "",
        content,
        rating: rating || 0,
        pros: pros || [],
        cons: cons || [],
        verdict: verdict || "",
        bestFor: bestFor || "",
        status: status || "DRAFT",
        featured: featured || false,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: "Review created successfully",
    })
  } catch (error) {
    console.error("Error creating review:", error)
    
    // Check if it's a foreign key constraint error
    if (error instanceof Error && error.message.includes("Foreign key constraint")) {
      return NextResponse.json(
        { error: "The selected product does not exist. Please select a valid product." },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create review" },
      { status: 500 }
    )
  }
}
