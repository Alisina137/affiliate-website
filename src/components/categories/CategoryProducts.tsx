// src/components/categories/CategoryProducts.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Star, ShoppingCart, Eye, Package, ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  price?: number | null
  currency: string
  rating?: number | null
  reviewCount: number
  images: string[]
  brand?: {
    id: string
    name: string
    slug: string
  } | null
}

interface CategoryProductsProps {
  products: Product[]
  total: number
  currentPage: number
  totalPages: number
  limit: number
  categorySlug: string
  currentFilters: {
    brandId?: string
    minPrice?: number
    maxPrice?: number
    sortBy: string
    sortOrder: "asc" | "desc"
  }
}

export function CategoryProducts({
  products,
  total,
  currentPage,
  totalPages,
  limit,
  categorySlug,
  currentFilters,
}: CategoryProductsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    
    // Preserve existing filters
    if (currentFilters.brandId) params.set("brandId", currentFilters.brandId)
    if (currentFilters.minPrice) params.set("minPrice", currentFilters.minPrice.toString())
    if (currentFilters.maxPrice) params.set("maxPrice", currentFilters.maxPrice.toString())
    if (currentFilters.sortBy && currentFilters.sortBy !== "createdAt") {
      params.set("sortBy", currentFilters.sortBy)
    }
    if (currentFilters.sortOrder && currentFilters.sortOrder !== "desc") {
      params.set("sortOrder", currentFilters.sortOrder)
    }
    
    params.set("page", page.toString())

    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-gray-500 max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or browse other categories.
        </p>
        <Link
          href={`/categories/${categorySlug}`}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Clear All Filters
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Results info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{Math.min(products.length, limit)}</span> of{" "}
          <span className="font-medium">{total}</span> products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Image */}
            <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="h-12 w-12" />
                </div>
              )}
              
              {/* Quick view overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Quick View
                </span>
              </div>
            </Link>

            {/* Content */}
            <div className="p-4">
              {/* Brand */}
              {product.brand && (
                <Link
                  href={`/brands/${product.brand.slug}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {product.brand.name}
                </Link>
              )}

              {/* Name */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-sm mt-1 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                </div>
              )}

              {/* Price */}
              {product.price && (
                <p className="text-lg font-bold text-blue-600 mt-2">
                  {formatPrice(product.price, product.currency)}
                </p>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 text-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNumber: number
              if (totalPages <= 7) {
                pageNumber = i + 1
              } else if (currentPage <= 4) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNumber = totalPages - 6 + i
              } else {
                pageNumber = currentPage - 3 + i
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
