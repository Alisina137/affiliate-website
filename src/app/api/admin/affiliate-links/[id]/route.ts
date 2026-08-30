// src/app/api/admin/affiliate-links/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Get a single affiliate link by ID
export async function GET(
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const link = await db.affiliateLink.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Affiliate link not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("Error fetching affiliate link:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate link" },
      { status: 500 },
    );
  }
}

// PUT - Update an affiliate link
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
      productId,
      merchant,
      url,
      label,
      trackingUrl,
      country,
      priority,
      isActive,
    } = body;

    if (!productId || !merchant || !url) {
      return NextResponse.json(
        { error: "Product ID, merchant, and URL are required" },
        { status: 400 },
      );
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const link = await db.affiliateLink.update({
      where: { id },
      data: {
        productId,
        merchant,
        url,
        label: label || "Check Price",
        trackingUrl: trackingUrl || null,
        country: country || "US",
        priority: priority || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: link,
      message: "Affiliate link updated successfully",
    });
  } catch (error) {
    console.error("Error updating affiliate link:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update affiliate link",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete an affiliate link
export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db.affiliateLink.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Affiliate link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting affiliate link:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete affiliate link",
      },
      { status: 500 },
    );
  }
}
