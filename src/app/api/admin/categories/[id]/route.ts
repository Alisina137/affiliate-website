// src/app/api/admin/categories/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url().optional(),
  nicheId: z.string(),
  parentId: z.string().nullable().optional(),
  order: z.number().int().default(0),
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
    const result = categorySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: result.data,
    })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
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

    // Check if category has products
    const productCount = await db.product.count({
      where: { categoryId: params.id },
    })

    if (productCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with products. Remove or reassign products first." },
        { status: 409 }
      )
    }

    await db.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
