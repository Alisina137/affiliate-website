// src/components/products/ProductAffiliateCTA.tsx
"use client"

import { useState } from "react"
import { ShoppingCart, ArrowRight, Shield, Clock, CheckCircle, ExternalLink } from "lucide-react"

interface AffiliateLink {
  id: string
  url: string
  label: string
  merchant: string
  trackingUrl?: string | null
  priority: number
  isActive: boolean
}

interface ProductAffiliateCTAProps {
  product: {
    id: string
    name: string
    price?: number | null
    currency: string
    affiliateLinks?: AffiliateLink[]
    availability?: string
    rating?: number | null
  }
}

export function ProductAffiliateCTA({ product }: ProductAffiliateCTAProps) {
  const [selectedLink, setSelectedLink] = useState<AffiliateLink | null>(
    product.affiliateLinks && product.affiliateLinks.length > 0
      ? product.affiliateLinks[0]
      : null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAffiliateClick = async (link: AffiliateLink) => {
    setIsLoading(true)
    try {
      // Track the click
      await fetch("/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateLinkId: link.id,
          productId: product.id,
        }),
      })
    } catch (error) {
      console.error("Error tracking affiliate click:", error)
    } finally {
      setIsLoading(false)
      // Open the affiliate link
      window.open(link.url, "_blank")
    }
  }

  const displayedLinks = showAll
    ? product.affiliateLinks
    : product.affiliateLinks?.slice(0, 3)

  const hasLinks = product.affiliateLinks && product.affiliateLinks.length > 0

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-blue-100 p-6">
      {/* Price Display */}
      {product.price && (
        <div className="text-center pb-4 border-b">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price, product.currency)}
          </p>
          {product.rating && product.rating > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              ⭐ {product.rating.toFixed(1)} / 5.0
            </p>
          )}
          {product.availability === "IN_STOCK" && (
            <div className="flex items-center justify-center gap-1 mt-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>In Stock</span>
            </div>
          )}
        </div>
      )}

      {/* Trust Badges */}
      <div className="flex justify-center gap-4 py-3 text-xs text-gray-500 border-b">
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4 text-blue-500" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>24/7 Support</span>
        </div>
      </div>

      {/* Affiliate Links */}
      {hasLinks ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Buy from:</p>
          {displayedLinks?.map((link) => (
            <button
              key={link.id}
              onClick={() => handleAffiliateClick(link)}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <span className="font-medium text-blue-700">{link.merchant}</span>
              <span className="flex items-center gap-1 text-blue-600">
                {link.label || "Check Price"}
                <ExternalLink className="h-4 w-4" />
              </span>
            </button>
          ))}

          {product.affiliateLinks && product.affiliateLinks.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center text-sm text-blue-600 hover:underline mt-2"
            >
              {showAll ? "Show Less" : `Show ${product.affiliateLinks.length - 3} More`}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
          <p>No affiliate links available</p>
          <p className="text-xs mt-1">Check back later for purchasing options</p>
        </div>
      )}

      {/* Primary CTA Button (Best Link) */}
      {selectedLink && (
        <button
          onClick={() => handleAffiliateClick(selectedLink)}
          disabled={isLoading}
          className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Buy Now at {selectedLink.merchant}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      )}

      {/* Disclosure */}
      <p className="mt-3 text-xs text-gray-400 text-center">
        As an affiliate, we may earn a commission from qualifying purchases.
      </p>
    </div>
  )
}
