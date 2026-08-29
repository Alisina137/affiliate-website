// src/app/api/admin/affiliate-programs/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const merchantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
})

const programSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  commission: z.string().optional(),
  cookieDuration: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
  merchants: z.array(merchantSchema).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = programSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { merchants, ...programData } = result.data

    const program = await db.affiliateProgram.create({
      data: {
        ...programData,
        merchants: {
          create: merchants?.map((m: any) => ({
            name: m.name,
            slug: m.slug,
            description: m.description,
            logo: m.logo,
            website: m.website,
          })) || [],
        },
      },
      include: {
        merchants: true,
      },
    })

    return NextResponse.json({ success: true, data: program })
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    )
  }
}
