// src/app/api/products/[slug]/route.ts
import { NextResponse } from "next/server";
import { productService } from "@/services";

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const product = await productService.getBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
