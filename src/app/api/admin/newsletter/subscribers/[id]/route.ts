// src/app/api/admin/newsletter/subscribers/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = body

    const subscriber = await db.subscriber.update({
      where: { id: params.id },
      data: { isActive },
    })

    return NextResponse.json({ success: true, data: subscriber })
  } catch (error) {
    console.error("Error updating subscriber:", error)
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.subscriber.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subscriber:", error)
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    )
  }
}
