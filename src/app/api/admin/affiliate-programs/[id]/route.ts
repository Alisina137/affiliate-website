// src/app/api/admin/affiliate-programs/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const merchantSchema = z.object({
  id: z.string().optional(),
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
    const result = programSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { merchants, ...programData } = result.data

    // Update program
    const program = await db.affiliateProgram.update({
      where: { id: params.id },
      data: programData,
    })

    // Handle merchants
    if (merchants) {
      // Get existing merchants
      const existingMerchants = await db.affiliateMerchant.findMany({
        where: { programId: params.id },
        select: { id: true },
      })

      const existingIds = existingMerchants.map(m => m.id)
      const newIds = merchants.filter((m: any) => m.id).map((m: any) => m.id)
      const idsToDelete = existingIds.filter(id => !newIds.includes(id))

      // Delete removed merchants
      if (idsToDelete.length > 0) {
        await db.affiliateMerchant.deleteMany({
          where: { id: { in: idsToDelete } },
        })
      }

      // Update or create merchants
      for (const merchant of merchants) {
        if (merchant.id) {
          await db.affiliateMerchant.update({
            where: { id: merchant.id },
            data: {
              name: merchant.name,
              slug: merchant.slug,
              description: merchant.description,
              logo: merchant.logo,
              website: merchant.website,
            },
          })
        } else {
          await db.affiliateMerchant.create({
            data: {
              programId: params.id,
              name: merchant.name,
              slug: merchant.slug,
              description: merchant.description,
              logo: merchant.logo,
              website: merchant.website,
            },
          })
        }
      }
    }

    const updatedProgram = await db.affiliateProgram.findUnique({
      where: { id: params.id },
      include: {
        merchants: true,
      },
    })

    return NextResponse.json({ success: true, data: updatedProgram })
  } catch (error) {
    console.error("Error updating program:", error)
    return NextResponse.json(
      { error: "Failed to update program" },
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

    await db.affiliateProgram.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting program:", error)
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    )
  }
}
