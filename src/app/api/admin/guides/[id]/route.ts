// src/app/api/admin/guides/[id]/route.ts
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

    const guide = await db.guide.findUnique({
      where: { id: params.id },
    })

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: guide })
  } catch (error) {
    console.error("Error fetching guide:", error)
    return NextResponse.json(
      { error: "Failed to fetch guide" },
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
    const guide = await db.guide.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ success: true, data: guide })
  } catch (error) {
    console.error("Error updating guide:", error)
    return NextResponse.json(
      { error: "Failed to update guide" },
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

    await db.guide.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting guide:", error)
    return NextResponse.json(
      { error: "Failed to delete guide" },
      { status: 500 }
    )
  }
}
