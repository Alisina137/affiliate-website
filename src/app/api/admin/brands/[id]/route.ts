// src/app/api/admin/brands/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        niche: true,
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 },
    );
  }
}

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
    const {
      name,
      slug,
      description,
      logo,
      website,
      nicheId,
      foundedYear,
      headquarters,
      isActive,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const brand = await db.brand.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || null,
        website: website || null,
        nicheId: nicheId || null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        headquarters: headquarters || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: brand,
      message: "Brand updated successfully",
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update brand",
      },
      { status: 500 },
    );
  }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if brand has products
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (brand._count.products > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete brand with existing products. Remove products first.",
        },
        { status: 400 },
      );
    }

    await db.brand.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete brand",
      },
      { status: 500 },
    );
  }
}
