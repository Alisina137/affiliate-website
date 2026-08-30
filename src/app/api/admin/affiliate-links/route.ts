// src/app/api/admin/affiliate-links/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all affiliate links
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const productId = searchParams.get("productId") || undefined

    const where: any = {}
    if (productId) {
      where.productId = productId
    }

    const [affiliateLinks, total] = await Promise.all([
      db.affiliateLink.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      db.affiliateLink.count({ where }),
    ])

    return NextResponse.json({
      data: affiliateLinks,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching affiliate links:", error)
    return NextResponse.json(
      { error: "Failed to fetch affiliate links" },
      { status: 500 }
    )
  }
}

// POST - Create a new affiliate link
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productId, merchant, url, label, trackingUrl, country, priority } = body

    // Validate required fields
    if (!productId || !merchant || !url) {
      return NextResponse.json(
        { error: "Product ID, merchant, and URL are required" },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Create affiliate link
    const affiliateLink = await db.affiliateLink.create({
      data: {
        productId,
        merchant,
        url,
        label: label || "Check Price",
        trackingUrl: trackingUrl || null,
        country: country || "US",
        priority: priority || 0,
      },
    })

    return NextResponse.json({
      success: true,
      data: affiliateLink,
      message: "Affiliate link created successfully",
    })
  } catch (error) {
    console.error("Error creating affiliate link:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create affiliate link" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an affiliate link
export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Affiliate link ID is required" },
        { status: 400 }
      )
    }

    await db.affiliateLink.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Affiliate link deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting affiliate link:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete affiliate link" },
      { status: 500 }
    )
  }
}
