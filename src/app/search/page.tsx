// src/app/search/page.tsx
import { Suspense } from "react"
import { SearchResults } from "@/components/search/SearchResults"
import { SearchFilters } from "@/components/search/SearchFilters"
import { SearchInput } from "@/components/search/SearchInput"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    type?: string
    sortBy?: string
    sortOrder?: string
    page?: string
    categoryId?: string
    brandId?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""
  const currentPage = parseInt(params.page || "1")
  const limit = 20

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-gray-600 mb-8">Find products, reviews, comparisons, and more</p>

        {/* Search Input */}
        <div className="max-w-2xl mb-8">
          <SearchInput initialQuery={query} />
        </div>

        {/* Results */}
        {query.length >= 2 ? (
          <Suspense fallback={<div className="py-12 text-center text-gray-500">Loading results...</div>}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <SearchFilters 
                  currentFilters={{
                    type: params.type || "all",
                    sortBy: (params.sortBy as any) || "relevance",
                    sortOrder: (params.sortOrder as any) || "desc",
                  }}
                />
              </div>
              <div className="lg:col-span-3">
                <SearchResults 
                  query={query}
                  currentPage={currentPage}
                  limit={limit}
                  filters={{
                    type: params.type,
                    sortBy: params.sortBy as any,
                    sortOrder: params.sortOrder as any,
                    categoryId: params.categoryId,
                    brandId: params.brandId,
                    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
                    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
                  }}
                />
              </div>
            </div>
          </Suspense>
        ) : query.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg">Enter a search term to find products, reviews, and guides.</p>
            <p className="text-sm mt-2">Try searching for "laptops", "headphones", or "best gaming mouse"</p>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Please enter at least 2 characters to search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
