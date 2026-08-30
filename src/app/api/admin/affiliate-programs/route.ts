// src/app/api/admin/affiliate-programs/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// Validation schema matching your Prisma model
const affiliateProgramSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
})

// GET - List all affiliate programs
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || ""

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [programs, total] = await Promise.all([
      db.affiliateProgram.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      db.affiliateProgram.count({ where }),
    ])

    console.log(`Found ${programs.length} affiliate programs`)

    return NextResponse.json({
      data: programs,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching affiliate programs:", error)
    return NextResponse.json(
      { error: "Failed to fetch affiliate programs" },
      { status: 500 }
    )
  }
}

// POST - Create a new affiliate program
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received body:", body)
    
    // Validate input - only fields that exist in schema
    const result = affiliateProgramSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      )
    }

    const { name, slug, description, website, logo, isActive } = result.data

    // Check if slug already exists
    const existing = await db.affiliateProgram.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: `Slug "${slug}" already exists. Please use a different slug.` },
        { status: 400 }
      )
    }

    // Create the affiliate program
    const program = await db.affiliateProgram.create({
      data: {
        name,
        slug,
        description: description || null,
        website: website || null,
        logo: logo || null,
        isActive: isActive ?? true,
      },
    })

    console.log("Created affiliate program:", program)

    return NextResponse.json({
      success: true,
      data: program,
      message: "Affiliate program created successfully",
    })
  } catch (error) {
    console.error("Error creating affiliate program:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create affiliate program",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete an affiliate program
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
        { error: "Program ID is required" },
        { status: 400 }
      )
    }

    await db.affiliateProgram.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Affiliate program deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting affiliate program:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete affiliate program" },
      { status: 500 }
    )
  }
}
