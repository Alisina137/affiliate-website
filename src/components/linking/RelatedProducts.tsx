// src/components/linking/RelatedProducts.tsx
import Link from "next/link"
import { Package, Star, ArrowRight } from "lucide-react"

interface RelatedProduct {
  id: string
  title: string
  slug: string
  type: string
  url: string
  relevance: number
  reason: string
  image?: string
  price?: number
  rating?: number
}

interface RelatedProductsProps {
  products: RelatedProduct[]
  title?: string
  limit?: number
}

export function RelatedProducts({ products, title = "Related Products", limit = 4 }: RelatedProductsProps) {
  if (!products || products.length === 0) return null

  const displayProducts = products.slice(0, limit)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={product.url}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Package className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
                {product.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {product.price && (
                  <span className="text-sm font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                )}
                {product.rating && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {product.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{product.reason}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-2" />
          </Link>
        ))}
      </div>
    </div>
  )
}
