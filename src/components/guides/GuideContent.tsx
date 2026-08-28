// src/components/guides/GuideContent.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ShoppingCart, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
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
  affiliateLinks?: Array<{
    id: string
    url: string
    label: string
    merchant: string
  }>
}

interface GuideContentProps {
  guide: {
    id: string
    content?: string | null
    tableOfContents?: any
    guideProducts: Array<{
      id: string
      context?: string | null
      order: number
      product: Product
    }>
  }
}

export function GuideContent({ guide }: GuideContentProps) {
  const [showAllProducts, setShowAllProducts] = useState(false)

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  // Parse table of contents
  let tocItems: string[] = []
  if (guide.tableOfContents) {
    if (typeof guide.tableOfContents === "string") {
      try {
        tocItems = JSON.parse(guide.tableOfContents)
      } catch {
        tocItems = []
      }
    } else if (Array.isArray(guide.tableOfContents)) {
      tocItems = guide.tableOfContents
    }
  }

  // Render content with paragraphs
  const renderContent = () => {
    if (!guide.content) return null

    // Check if content has HTML
    if (guide.content.includes("<") || guide.content.includes(">")) {
      return <div dangerouslySetInnerHTML={{ __html: guide.content }} />
    }

    // Plain text - split into paragraphs
    const paragraphs = guide.content.split("\n\n").filter(p => p.trim())
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-700 leading-relaxed mb-4">
        {paragraph}
      </p>
    ))
  }

  // Get top 3 products for display
  const displayedProducts = showAllProducts 
    ? guide.guideProducts 
    : guide.guideProducts.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Table of Contents */}
      {tocItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg border p-6">
          <h3 className="font-semibold text-lg mb-3">Table of Contents</h3>
          <ul className="space-y-1">
            {tocItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={`#section-${index + 1}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="prose prose-sm max-w-none">
          {renderContent()}
        </div>
      </div>

      {/* Recommended Products */}
      {guide.guideProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">Recommended Products</h3>
          <div className="space-y-4">
            {displayedProducts.map((gp, index) => {
              const product = gp.product
              const bestLink = product.affiliateLinks?.[0]

              return (
                <div key={gp.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          #{index + 1}
                        </span>
                        <Link 
                          href={`/products/${product.slug}`}
                          className="font-semibold hover:text-blue-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                        {product.brand && (
                          <span className="text-xs text-gray-500">by {product.brand.name}</span>
                        )}
                      </div>
                      {gp.context && (
                        <p className="text-sm text-gray-600 mt-1">{gp.context}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        {product.price && (
                          <span className="font-bold text-blue-600">
                            {formatPrice(product.price, product.currency)}
                          </span>
                        )}
                        {product.rating && product.rating > 0 && (
                          <span className="text-gray-500">⭐ {product.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                      {bestLink && (
                        <a
                          href={bestLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Buy Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Show More/Less */}
          {guide.guideProducts.length > 3 && (
            <button
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {showAllProducts ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show All Products ({guide.guideProducts.length})
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Ready to Make a Decision?</h3>
        <p className="text-blue-100 mb-4">Browse our full product catalog to find the perfect match.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          Browse All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
