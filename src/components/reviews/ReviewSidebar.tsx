// src/components/reviews/ReviewSidebar.tsx
import Link from "next/link"
import { ShoppingCart, ArrowRight, Package, Star } from "lucide-react"

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

interface ReviewSidebarProps {
  product?: Product | null
  relatedProducts: Product[]
}

export function ReviewSidebar({ product, relatedProducts }: ReviewSidebarProps) {
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  // Get the best affiliate link
  const bestLink = product?.affiliateLinks?.[0]

  return (
    <div className="space-y-6">
      {/* Product Card */}
      {product && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-3">Product Details</h3>
          
          <div className="space-y-3">
            {product.brand && (
              <p className="text-sm">
                <span className="text-gray-500">Brand:</span>{" "}
                <Link href={`/brands/${product.brand.slug}`} className="text-blue-600 hover:underline">
                  {product.brand.name}
                </Link>
              </p>
            )}
            
            {product.rating && product.rating > 0 && (
              <p className="text-sm flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-500">({product.reviewCount || 0} reviews)</span>
              </p>
            )}
            
            {product.price && (
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(product.price, product.currency)}
              </p>
            )}

            {/* Affiliate Link */}
            {bestLink && (
              <a
                href={bestLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Buy at {bestLink.merchant}
              </a>
            )}

            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center gap-1 w-full text-sm text-blue-600 hover:text-blue-800"
            >
              View Full Product Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-3">Related Products</h3>
          <div className="space-y-3">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/products/${related.slug}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                    {related.name}
                  </p>
                  {related.brand && (
                    <p className="text-xs text-gray-500">{related.brand.name}</p>
                  )}
                  {related.price && (
                    <p className="text-xs font-bold text-blue-600">
                      {formatPrice(related.price, related.currency)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
