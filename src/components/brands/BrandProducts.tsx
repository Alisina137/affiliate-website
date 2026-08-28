// src/components/brands/BrandProducts.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Star, ShoppingCart, Package, ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price?: number | null
  currency: string
  rating?: number | null
  reviewCount: number
  images: string[]
  shortDescription?: string | null
  availability: string
  category?: {
    id: string
    name: string
    slug: string
  } | null
  affiliateLinks?: Array<{
    id: string
    url: string
    label: string
    merchant: string
  }>
}

interface BrandProductsProps {
  products: Product[]
  total: number
  brandSlug: string
}

export function BrandProducts({ products, total, brandSlug }: BrandProductsProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const limit = 12
  const totalPages = Math.ceil(total / limit)

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  const handleSortChange = (value: string) => {
    if (value === "price_asc") {
      setSortBy("price")
      setSortOrder("asc")
    } else if (value === "price_desc") {
      setSortBy("price")
      setSortOrder("desc")
    } else if (value === "rating") {
      setSortBy("rating")
      setSortOrder("desc")
    } else {
      setSortBy("createdAt")
      setSortOrder("desc")
    }
    setCurrentPage(1)
    // In a real implementation, you would fetch new data here
    router.refresh()
  }

  const getSortValue = () => {
    if (sortBy === "price" && sortOrder === "asc") return "price_asc"
    if (sortBy === "price" && sortOrder === "desc") return "price_desc"
    if (sortBy === "rating") return "rating"
    return "newest"
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">No Products Found</h3>
        <p className="text-gray-400 mt-2">This brand doesn't have any products yet.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{Math.min(products.length, limit)}</span> of{" "}
          <span className="font-medium">{total}</span> products
        </p>
        <select
          value={getSortValue()}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const bestLink = product.affiliateLinks?.[0]
          return (
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
              </Link>

              {/* Content */}
              <div className="p-4">
                {product.category && (
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {product.category.name}
                  </Link>
                )}

                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-sm mt-1 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                  </div>
                )}

                {product.price && (
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {formatPrice(product.price, product.currency)}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 text-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                  {bestLink && (
                    <a
                      href={bestLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      title={`Buy at ${bestLink.merchant}`}
                    >
                      <ShoppingCart className="h-5 w-5 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
