// src/components/comparisons/ComparisonTable.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Check, X, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price?: number | null
  currency: string
  rating?: number | null
  reviewCount: number
  images: string[]
  description?: string | null
  shortDescription?: string | null
  bestFor?: string | null
  availability: string
  brand?: {
    id: string
    name: string
    slug: string
  } | null
  specifications?: Record<string, string | number | boolean | null> | null
  features?: string[] | null
  affiliateLinks?: Array<{
    id: string
    url: string
    label: string
    merchant: string
  }>
}

interface ComparisonTableProps {
  comparison: {
    id: string
    products: Array<{
      id: string
      productId: string
      strengths: string[]
      weaknesses: string[]
      bestFor?: string | null
      order: number
    }>
  }
  products: Product[]
}

export function ComparisonTable({ comparison, products }: ComparisonTableProps) {
  const [showAllSpecs, setShowAllSpecs] = useState(false)

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  // Get all unique specification keys from all products
  const getAllSpecKeys = () => {
    const keys = new Set<string>()
    products.forEach((product) => {
      if (product.specifications && typeof product.specifications === "object") {
        Object.keys(product.specifications).forEach((key) => keys.add(key))
      }
    })
    return Array.from(keys)
  }

  const specKeys = getAllSpecKeys()
  const displaySpecs = showAllSpecs ? specKeys : specKeys.slice(0, 6)

  // Get comparison product data for each product
  const getComparisonProduct = (productId: string) => {
    return comparison.products.find((cp) => cp.productId === productId)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/4 min-w-37.5">
                Feature
              </th>
              {products.map((product) => (
                <th key={product.id} className="px-4 py-3 text-center w-1/4 min-w-50">
                  <div className="flex flex-col items-center">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {product.name}
                    </Link>
                    {product.brand && (
                      <span className="text-xs text-gray-500">{product.brand.name}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">Price</td>
              {products.map((product) => (
                <td key={product.id} className="px-4 py-3 text-center">
                  {product.price ? (
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="px-4 py-3 text-center">
                  {product.rating && product.rating > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Best For Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">Best For</td>
              {products.map((product) => {
                const cp = getComparisonProduct(product.id)
                return (
                  <td key={product.id} className="px-4 py-3 text-center text-sm">
                    {cp?.bestFor || product.bestFor || <span className="text-gray-400">—</span>}
                  </td>
                )
              })}
            </tr>

            {/* Availability Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">Availability</td>
              {products.map((product) => (
                <td key={product.id} className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.availability === "IN_STOCK" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {product.availability === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              ))}
            </tr>

            {/* Strengths Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">Strengths</td>
              {products.map((product) => {
                const cp = getComparisonProduct(product.id)
                const strengths = cp?.strengths || []
                return (
                  <td key={product.id} className="px-4 py-3 text-sm">
                    {strengths.length > 0 ? (
                      <ul className="space-y-1">
                        {strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1 text-green-600">
                            <Check className="h-4 w-4 shrink-0 mt-0.5" />
                            <span className="text-gray-700">{s}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* Weaknesses Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">Weaknesses</td>
              {products.map((product) => {
                const cp = getComparisonProduct(product.id)
                const weaknesses = cp?.weaknesses || []
                return (
                  <td key={product.id} className="px-4 py-3 text-sm">
                    {weaknesses.length > 0 ? (
                      <ul className="space-y-1">
                        {weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-1 text-red-600">
                            <X className="h-4 w-4 shrink-0 mt-0.5" />
                            <span className="text-gray-700">{w}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* Specifications */}
            {displaySpecs.map((key) => (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-sm">
                    {product.specifications && typeof product.specifications === "object" && product.specifications[key] !== undefined ? (
                      String(product.specifications[key])
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Show More/Less Button */}
            {specKeys.length > 6 && (
              <tr className="hover:bg-gray-50">
                <td colSpan={products.length + 1} className="px-4 py-3 text-center">
                  <button
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    {showAllSpecs ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show All Specifications ({specKeys.length})
                      </>
                    )}
                  </button>
                </td>
              </tr>
            )}

            {/* CTA Row */}
            <tr className="bg-blue-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-700">Buy Now</td>
              {products.map((product) => {
                const bestLink = product.affiliateLinks?.[0]
                return (
                  <td key={product.id} className="px-4 py-3 text-center">
                    {bestLink ? (
                      <a
                        href={bestLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Buy Now
                      </a>
                    ) : (
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Product
                      </Link>
                    )}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
