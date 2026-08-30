// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Unwrap params using await
    const { id } = await params

    const product = await db.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        niche: true,
        affiliateLinks: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, shortDescription, price, currency, brandId, categoryId, nicheId, images, features, bestFor, availability } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        shortDescription: shortDescription || null,
        price: price || null,
        currency: currency || "USD",
        brandId: brandId || null,
        categoryId: categoryId || null,
        nicheId: nicheId || null,
        images: images || [],
        features: features || [],
        bestFor: bestFor || null,
        availability: availability || "IN_STOCK",
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Safely unwrap params
    if (!context || !context.params) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const { id } = await context.params

    console.log("Deleting product with ID:", id)

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete related records
    try {
      // Delete affiliate links
      await db.affiliateLink.deleteMany({
        where: { productId: id },
      })

      // Delete reviews
      await db.review.deleteMany({
        where: { productId: id },
      })

      // Delete comparison entries
      await db.comparisonProduct.deleteMany({
        where: { productId: id },
      })

      // Delete best-of entries
      await db.bestOfEntry.deleteMany({
        where: { productId: id },
      })

      // Delete guide products
      await db.guideProduct.deleteMany({
        where: { productId: id },
      })
    } catch (error) {
      console.error("Error deleting related records:", error)
      // Continue with product deletion even if related records fail
    }

    // Delete the product
    await db.product.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 }
    )
  }
}
