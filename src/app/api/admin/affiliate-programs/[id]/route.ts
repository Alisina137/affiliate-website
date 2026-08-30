// src/app/api/admin/affiliate-programs/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Get a single affiliate program by ID
export async function GET(
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const program = await db.affiliateProgram.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Affiliate program not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Error fetching affiliate program:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate program" },
      { status: 500 },
    );
  }
}

// PUT - Update an affiliate program
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, website, logo, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    // Check if slug already exists for another program
    const existing = await db.affiliateProgram.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `Slug "${slug}" already exists. Please use a different slug.`,
        },
        { status: 400 },
      );
    }

    const program = await db.affiliateProgram.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        website: website || null,
        logo: logo || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: program,
      message: "Affiliate program updated successfully",
    });
  } catch (error) {
    console.error("Error updating affiliate program:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update affiliate program",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete an affiliate program
export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db.affiliateProgram.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Affiliate program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting affiliate program:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete affiliate program",
      },
      { status: 500 },
    );
  }
}
