// src/app/api/admin/brands/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  { params }: { params: { id: string } }
) {
  try {
    const brand = await db.brand.findUnique({
      where: { id: params.id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
        },
        _count: {
          select: { products: true },
        },
      },
    })

    if (!brand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: brand,
    })
  } catch (error) {
    console.error("Error fetching brand:", error)
    return NextResponse.json(
      { error: "Failed to fetch brand" },
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
    const { name, slug, description, logo, website, isActive } = body

    const brand = await db.brand.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        logo,
        website,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: brand,
    })
  } catch (error) {
    console.error("Error updating brand:", error)
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    await db.brand.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting brand:", error)
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    )
  }
}
