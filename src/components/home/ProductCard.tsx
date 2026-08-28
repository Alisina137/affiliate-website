// src/components/home/ProductCard.tsx
import Link from "next/link"
import Image from "next/image"
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
  id,
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
      <div className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="aspect-square bg-gray-100 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {brand && (
            <p className="text-xs text-gray-500 mb-1">{brand.name}</p>
          )}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {rating !== undefined && rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
              </div>
              {reviewCount !== undefined && reviewCount > 0 && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          {price !== undefined && price !== null && (
            <p className="text-lg font-bold text-blue-600 mt-2">
              {formatPrice(price)}
            </p>
          )}

          {/* CTA */}
          <div className="mt-3 flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-800">
            View Product
            <ShoppingCart className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
