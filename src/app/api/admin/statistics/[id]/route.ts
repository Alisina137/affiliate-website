// src/app/api/admin/statistics/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const statistic = await db.statistic.findUnique({
      where: { id: params.id },
    });

    if (!statistic) {
      return NextResponse.json(
        { error: "Statistics not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: statistic });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const statistic = await db.statistic.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, data: statistic });
  } catch (error) {
    console.error("Error updating statistics:", error);
    return NextResponse.json(
      { error: "Failed to update statistics" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.statistic.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting statistics:", error);
    return NextResponse.json(
      { error: "Failed to delete statistics" },
      { status: 500 },
    );
  }
}
