// src/app/api/admin/brands/route.ts
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

export async function POST(request: Request) {
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

    const brand = await db.brand.create({
      data: result.data,
    })

    return NextResponse.json({ success: true, data: brand })
  } catch (error) {
    console.error("Error creating brand:", error)
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    )
  }
}
