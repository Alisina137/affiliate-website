// src/components/products/ProductSummary.tsx
"use client"

import Link from "next/link"
import { Star, Check, X, Info } from "lucide-react"

interface ProductSummaryProps {
  product: {
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
    bestFor?: string | null
    availability: string
    brand?: {
      id: string
      name: string
      slug: string
      logo?: string | null
    } | null
    category?: {
      id: string
      name: string
      slug: string
    } | null
    features?: unknown
    pros?: string[] | null
    cons?: string[] | null
    specifications?: unknown
  }
}

export function ProductSummary({ product }: ProductSummaryProps) {
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "text-green-600 bg-green-50"
      case "OUT_OF_STOCK":
        return "text-red-600 bg-red-50"
      case "PRE_ORDER":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getAvailabilityLabel = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "In Stock"
      case "OUT_OF_STOCK":
        return "Out of Stock"
      case "PRE_ORDER":
        return "Pre-Order"
      default:
        return status
    }
  }

  // Parse features
  let features: string[] = []
  if (product.features) {
    if (typeof product.features === "string") {
      try {
        const parsed = JSON.parse(product.features)
        features = Array.isArray(parsed) ? parsed : [product.features]
      } catch {
        features = [product.features]
      }
    } else if (Array.isArray(product.features)) {
      features = product.features
    }
  }

  const pros = Array.isArray(product.pros) ? product.pros : []
  const cons = Array.isArray(product.cons) ? product.cons : []

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

      {/* Brand */}
      {product.brand && (
        <Link href={`/brands/${product.brand.slug}`} className="text-sm text-blue-600 hover:underline">
          {product.brand.name}
        </Link>
      )}

      {/* Rating */}
      {product.rating && product.rating > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-bold ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
        </div>
      )}

      {/* Price */}
      {product.price && (
        <div className="mt-4">
          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      )}

      {/* Availability */}
      <div className="mt-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(product.availability)}`}>
          <Info className="h-4 w-4" />
          {getAvailabilityLabel(product.availability)}
        </span>
      </div>

      {/* Best For */}
      {product.bestFor && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm font-medium text-blue-800">Best For:</p>
          <p className="text-sm text-blue-700">{product.bestFor}</p>
        </div>
      )}

      {/* Short Description */}
      {product.shortDescription && (
        <div className="mt-4">
          <p className="text-gray-600">{product.shortDescription}</p>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Key Features</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pros & Cons */}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {pros.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Pros</h4>
              <ul className="space-y-1">
                {pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2">Cons</h4>
              <ul className="space-y-1">
                {cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Long Description */}
      {product.description && (
        <div className="mt-6 prose prose-sm max-w-none">
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
        </div>
      )}
    </div>
  )
}

export default ProductSummary
