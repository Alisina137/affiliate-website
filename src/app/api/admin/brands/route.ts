// src/app/api/admin/brands/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [brands, total] = await Promise.all([
      db.brand.findMany({
        where,
        include: {
          niche: true,
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
        skip: offset,
        take: limit,
      }),
      db.brand.count({ where }),
    ])

    return NextResponse.json({
      data: brands,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, logo, website, nicheId, foundedYear, headquarters } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    const brand = await db.brand.create({
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || null,
        website: website || null,
        nicheId: nicheId || null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        headquarters: headquarters || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: brand,
      message: "Brand created successfully",
    })
  } catch (error) {
    console.error("Error creating brand:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create brand" },
      { status: 500 }
    )
  }
}

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
        { error: "Brand ID is required" },
        { status: 400 }
      )
    }

    await db.brand.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting brand:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete brand" },
      { status: 500 }
    )
  }
}
