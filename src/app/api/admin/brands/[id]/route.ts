// src/app/api/admin/brands/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const brandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  foundedYear: z.number().int().optional().nullable(),
  headquarters: z.string().optional(),
  nicheId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = brandSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const brand = await db.brand.update({
      where: { id: params.id },
      data: result.data,
    })

    return NextResponse.json({ success: true, data: brand })
  } catch (error) {
    console.error("Error updating brand:", error)
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.brand.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting brand:", error)
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    )
  }
}
