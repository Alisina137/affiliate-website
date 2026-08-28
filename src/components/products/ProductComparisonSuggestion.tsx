// src/components/products/ProductComparisonSuggestion.tsx
"use client"

import Link from "next/link"
import { GitCompare, ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price?: number | null
  rating?: number | null
  brand?: {
    name: string
    slug: string
  } | null
}

interface ProductComparisonSuggestionProps {
  product: Product
  similarProducts: Product[]
}

export function ProductComparisonSuggestion({ product, similarProducts }: ProductComparisonSuggestionProps) {
  if (!similarProducts || similarProducts.length === 0) {
    return null
  }

  // Get top 2 similar products for comparison
  const compareProducts = similarProducts.slice(0, 2)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <GitCompare className="h-5 w-5 text-blue-600" />
        <h3 className="text-xl font-bold">Compare with Similar Products</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        See how {product.name} compares to other popular products in the same category.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Current Product */}
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-xs text-blue-600 font-medium mb-1">Current</div>
          <h4 className="font-semibold">{product.name}</h4>
          {product.brand && (
            <p className="text-sm text-gray-500">{product.brand.name}</p>
          )}
          {product.price && (
            <p className="text-lg font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </p>
          )}
          {product.rating && (
            <p className="text-sm text-gray-500">⭐ {product.rating.toFixed(1)}</p>
          )}
        </div>

        {/* Similar Products */}
        {compareProducts.map((similar) => (
          <Link
            key={similar.id}
            href={`/products/${similar.slug}`}
            className="p-4 bg-white rounded-lg border hover:shadow-lg transition-all group"
          >
            <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
              {similar.name}
            </h4>
            {similar.brand && (
              <p className="text-sm text-gray-500">{similar.brand.name}</p>
            )}
            {similar.price && (
              <p className="text-lg font-bold text-blue-600">
                ${similar.price.toFixed(2)}
              </p>
            )}
            {similar.rating && (
              <p className="text-sm text-gray-500">⭐ {similar.rating.toFixed(1)}</p>
            )}
            <div className="mt-2 flex items-center text-sm text-blue-600 group-hover:text-blue-800">
              View Product
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={`/comparisons?product=${product.slug}`}
        className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
      >
        View all comparisons
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
