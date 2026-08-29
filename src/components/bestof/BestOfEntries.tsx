// src/components/bestof/BestOfEntries.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Check, X, ShoppingCart, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

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
  affiliateLinks?: Array<{
    id: string
    url: string
    label: string
    merchant: string
  }>
}

interface Entry {
  id: string
  order: number
  bestFor?: string | null
  summary?: string | null
  pros: string[]
  cons: string[]
  product: Product
}

interface BestOfEntriesProps {
  entries: Entry[]
}

export function BestOfEntries({ entries }: BestOfEntriesProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  const getMedal = (index: number) => {
    switch (index) {
      case 0:
        return { emoji: "🥇", color: "text-yellow-600", bg: "bg-yellow-100" }
      case 1:
        return { emoji: "🥈", color: "text-gray-500", bg: "bg-gray-100" }
      case 2:
        return { emoji: "🥉", color: "text-amber-600", bg: "bg-amber-100" }
      default:
        return { emoji: `#${index + 1}`, color: "text-gray-400", bg: "bg-gray-50" }
    }
  }

  return (
    <div className="space-y-6">
      {entries.map((entry, index) => {
        const product = entry.product
        const bestLink = product.affiliateLinks?.[0]
        const isExpanded = expandedEntry === entry.id
        const medal = getMedal(index)

        return (
          <div key={entry.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Entry Header */}
            <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${medal.bg} shrink-0`}>
                <span className={`text-xl font-bold ${medal.color}`}>{medal.emoji}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/products/${product.slug}`}
                  className="text-lg font-semibold hover:text-blue-600 transition-colors"
                >
                  {product.name}
                </Link>
                {product.brand && (
                  <p className="text-sm text-gray-500">{product.brand.name}</p>
                )}
                {entry.bestFor && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    Best for: {entry.bestFor}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                  </div>
                )}
                {product.price && (
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price, product.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Summary */}
            {entry.summary && (
              <div className="px-6 pb-3">
                <p className="text-sm text-gray-600">{entry.summary}</p>
              </div>
            )}

            {/* Expandable Details */}
            <button
              onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
              className="w-full px-6 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-1 border-t"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show More Details
                </>
              )}
            </button>

            {isExpanded && (
              <div className="px-6 pb-6 pt-2 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pros */}
                  {entry.pros.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 text-sm mb-2">👍 Pros</h4>
                      <ul className="space-y-1">
                        {entry.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-600">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {entry.cons.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 text-sm mb-2">👎 Cons</h4>
                      <ul className="space-y-1">
                        {entry.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                            <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    View Full Product Details
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  {bestLink && (
                    <a
                      href={bestLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy at {bestLink.merchant}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
