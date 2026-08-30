// src/components/home/ProductCard.tsx
"use client"

import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  image?: string | null
  price?: number | null
  currency?: string
  rating?: number | null
  reviewCount?: number
  brand?: {
    name: string
    slug: string
  } | null
}

export function ProductCard({
  name,
  slug,
  image,
  price,
  currency = "USD",
  rating,
  reviewCount,
  brand,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  return (
    <Link href={`/products/${slug}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200/60 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
        {/* Image */}
        <div className="aspect-square bg-gray-50 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs sm:text-sm">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {brand && (
            <p className="text-xs text-gray-400 mb-0.5">{brand.name}</p>
          )}
          <h3 className="text-sm sm:text-base font-medium text-[#1a1a2e] group-hover:text-[#1a1a2e]/70 transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          {rating && rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#1a1a2e] text-[#1a1a2e]" />
                <span className="text-xs sm:text-sm font-medium ml-0.5">{rating.toFixed(1)}</span>
              </div>
              {reviewCount && reviewCount > 0 && (
                <span className="text-xs text-gray-400">({reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          {price && (
            <p className="text-base sm:text-lg font-bold text-[#1a1a2e] mt-1 sm:mt-2">
              {formatPrice(price)}
            </p>
          )}

          {/* CTA */}
          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-[#1a1a2e] font-medium group-hover:text-[#1a1a2e]/70 transition-colors">
            View Product
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
