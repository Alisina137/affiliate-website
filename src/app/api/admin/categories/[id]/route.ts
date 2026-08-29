// src/app/api/admin/categories/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
        },
        children: true,
        niche: true,
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, slug, description, image, nicheId, parentId, order, isActive } = body

    const category = await db.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        image,
        nicheId,
        parentId,
        order,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    await db.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
