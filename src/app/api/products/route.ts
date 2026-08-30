// src/app/api/products/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const includeInactive = searchParams.get("includeInactive") === "true"

    console.log("Fetching products with limit:", limit, "includeInactive:", includeInactive)

    // Build the where clause
    const where: any = {}
    
    // Only filter by isActive if not explicitly including inactive
    if (!includeInactive) {
      where.isActive = true
    }

    // Fetch products from database - using correct field names
    const products = await db.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,        // Changed from 'image' to 'images'
        price: true,
        currency: true,
        rating: true,
        reviewCount: true,
        isActive: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    const total = await db.product.count({ where })

    console.log(`Found ${products.length} products`)

    return NextResponse.json({
      data: products,
      total,
      page: 1,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
