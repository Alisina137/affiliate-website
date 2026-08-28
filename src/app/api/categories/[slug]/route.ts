// src/app/api/categories/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { categoryService } from "@/services"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const searchParams = request.nextUrl.searchParams

    const category = await categoryService.getBySlug(slug)

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Parse query parameters
    const brandId = searchParams.get("brandId") || undefined
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    // Get products
    const productsData = await categoryService.getProducts(category.id, {
      brandId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      limit,
      offset,
    })

    // Get brands in this category
    const brands = await categoryService.getBrands(category.id)

    return NextResponse.json({
      category,
      products: productsData.products,
      total: productsData.total,
      page: productsData.page,
      limit: productsData.limit,
      totalPages: productsData.totalPages,
      brands,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}
