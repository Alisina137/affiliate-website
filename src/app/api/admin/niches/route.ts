// src/app/api/admin/niches/route.ts
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
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [niches, total] = await Promise.all([
      db.niche.findMany({
        where,
        include: {
          _count: {
            select: { categories: true, brands: true, products: true },
          },
        },
        orderBy: { name: "asc" },
        skip: offset,
        take: limit,
      }),
      db.niche.count({ where }),
    ])

    return NextResponse.json({
      data: niches,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching niches:", error)
    return NextResponse.json(
      { error: "Failed to fetch niches" },
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
    const { name, slug, description, image } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    const niche = await db.niche.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: niche,
      message: "Niche created successfully",
    })
  } catch (error) {
    console.error("Error creating niche:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create niche" },
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
        { error: "Niche ID is required" },
        { status: 400 }
      )
    }

    await db.niche.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Niche deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting niche:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete niche" },
      { status: 500 }
    )
  }
}
