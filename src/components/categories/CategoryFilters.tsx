// src/components/categories/CategoryFilters.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react"

interface Brand {
  id: string
  name: string
  slug: string
}

interface CategoryFiltersProps {
  categoryId: string
  brands: Brand[]
  currentFilters: {
    brandId?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }
}

export function CategoryFilters({ categoryId, brands, currentFilters }: CategoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [filters, setFilters] = useState({
    brandId: currentFilters.brandId || "",
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
    sortBy: currentFilters.sortBy || "createdAt",
    sortOrder: currentFilters.sortOrder || "desc",
  })

  // Update filters when currentFilters changes
  useEffect(() => {
    setFilters({
      brandId: currentFilters.brandId || "",
      minPrice: currentFilters.minPrice || "",
      maxPrice: currentFilters.maxPrice || "",
      sortBy: currentFilters.sortBy || "createdAt",
      sortOrder: currentFilters.sortOrder || "desc",
    })
  }, [currentFilters])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.brandId) params.set("brandId", filters.brandId)
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString())
    if (filters.sortBy && filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy)
    if (filters.sortOrder && filters.sortOrder !== "desc") params.set("sortOrder", filters.sortOrder)
    
    // Reset to page 1 when filters change
    params.set("page", "1")

    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    setIsMobileOpen(false)
  }

  const clearFilters = () => {
    setFilters({
      brandId: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    })
    router.push(pathname)
    setIsMobileOpen(false)
  }

  const hasActiveFilters = () => {
    return !!(filters.brandId || filters.minPrice || filters.maxPrice || 
      (filters.sortBy && filters.sortBy !== "createdAt") ||
      (filters.sortOrder && filters.sortOrder !== "desc"))
  }

  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "reviewCount", label: "Most Popular" },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                Active
              </span>
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

        {/* Sort By */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Sort By</h3>
          <select
            value={filters.sortBy === "price" && filters.sortOrder === "asc" ? "price" :
                    filters.sortBy === "price" && filters.sortOrder === "desc" ? "price_desc" :
                    filters.sortBy || "createdAt"}
            onChange={(e) => {
              const value = e.target.value
              if (value === "price") {
                setFilters({ ...filters, sortBy: "price", sortOrder: "asc" })
              } else if (value === "price_desc") {
                setFilters({ ...filters, sortBy: "price", sortOrder: "desc" })
              } else {
                setFilters({ ...filters, sortBy: value, sortOrder: "desc" })
              }
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        {brands && brands.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Brand</h3>
            <select
              value={filters.brandId}
              onChange={(e) => setFilters({ ...filters, brandId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Price Range</h3>
          <div className="flex gap-2">
            <div>
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="Min"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="Max"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {filters.brandId && brands.find(b => b.id === filters.brandId) && (
                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                  Brand: {brands.find(b => b.id === filters.brandId)?.name}
                  <button onClick={() => setFilters({ ...filters, brandId: "" })}>
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

        {/* Mobile Close Button */}
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
