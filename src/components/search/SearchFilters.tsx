// src/components/search/SearchFilters.tsx
"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react"

interface SearchFiltersProps {
  currentFilters: {
    type: string
    sortBy: string
    sortOrder: string
    categoryId?: string
    brandId?: string
    minPrice?: number
    maxPrice?: number
  }
}

const contentTypes = [
  { value: "all", label: "All Content" },
  { value: "product", label: "Products" },
  { value: "review", label: "Reviews" },
  { value: "comparison", label: "Comparisons" },
  { value: "guide", label: "Guides" },
  { value: "brand", label: "Brands" },
  { value: "category", label: "Categories" },
]

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "createdAt", label: "Newest" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Highest Rated" },
]

export function SearchFilters({ currentFilters }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: currentFilters.type || "all",
    sortBy: currentFilters.sortBy || "relevance",
    sortOrder: currentFilters.sortOrder || "desc",
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    // Get current query from URL
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get("q") || ""

    if (query) params.set("q", query)
    if (filters.type && filters.type !== "all") params.set("type", filters.type)
    if (filters.sortBy && filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy)
    if (filters.sortOrder && filters.sortOrder !== "desc") params.set("sortOrder", filters.sortOrder)
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString())
    
    params.set("page", "1")

    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setIsMobileOpen(false)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get("q") || ""
    if (query) params.set("q", query)

    setFilters({
      type: "all",
      sortBy: "relevance",
      sortOrder: "desc",
      minPrice: "",
      maxPrice: "",
    })

    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setIsMobileOpen(false)
  }

  const hasActiveFilters = () => {
    return !!(filters.type !== "all" || filters.sortBy !== "relevance" || 
      filters.minPrice || filters.maxPrice)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">Active</span>
            )}
          </span>
          {isMobileOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`
        ${isMobileOpen ? "block" : "hidden"} lg:block
        bg-white rounded-lg shadow-sm border p-4 space-y-6
        ${isMobileOpen ? "fixed inset-0 z-50 overflow-y-auto p-6" : "relative"}
      `}>
        {isMobileOpen && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Content Type */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Content Type</h3>
          <div className="space-y-1">
            {contentTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={filters.type === type.value}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={applyFilters}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="pt-4 border-t">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.type !== "all" && (
                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                  Type: {contentTypes.find(t => t.value === filters.type)?.label}
                  <button onClick={() => setFilters({ ...filters, type: "all" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.minPrice && (
                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                  Min: ${filters.minPrice}
                  <button onClick={() => setFilters({ ...filters, minPrice: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.maxPrice && (
                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                  Max: ${filters.maxPrice}
                  <button onClick={() => setFilters({ ...filters, maxPrice: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Close Filters
          </button>
        )}
      </div>
    </>
  )
}
