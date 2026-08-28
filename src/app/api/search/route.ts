// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server"
import { searchService } from "@/services/search.service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") as any || "all"
    const categoryId = searchParams.get("categoryId") || undefined
    const brandId = searchParams.get("brandId") || undefined
    const nicheId = searchParams.get("nicheId") || undefined
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined
    const sortBy = searchParams.get("sortBy") as any || "relevance"
    const sortOrder = searchParams.get("sortOrder") as any || "desc"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get suggestions if query is short
    let suggestions: string[] = []
    if (query.length >= 2 && query.length < 4) {
      suggestions = await searchService.getSuggestions(query)
    }

    // Perform search
    const results = await searchService.search({
      query,
      type,
      categoryId,
      brandId,
      nicheId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      limit,
      offset,
    })

    return NextResponse.json({
      ...results,
      suggestions,
      query,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    )
  }
}
