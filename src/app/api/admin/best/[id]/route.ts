// src/app/api/admin/best/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bestOf = await db.bestOf.findUnique({
      where: { id: params.id },
    })

    if (!bestOf) {
      return NextResponse.json({ error: "Best Of list not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: bestOf })
  } catch (error) {
    console.error("Error fetching best-of:", error)
    return NextResponse.json(
      { error: "Failed to fetch best-of" },
      { status: 500 }
    )
  }
}

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
    const bestOf = await db.bestOf.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ success: true, data: bestOf })
  } catch (error) {
    console.error("Error updating best-of:", error)
    return NextResponse.json(
      { error: "Failed to update best-of" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.bestOf.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting best-of:", error)
    return NextResponse.json(
      { error: "Failed to delete best-of" },
      { status: 500 }
    )
  }
}
