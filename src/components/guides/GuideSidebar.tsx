// src/components/guides/GuideSidebar.tsx
import Link from "next/link"
import { Award, CheckCircle, BookOpen } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price?: number | null
  currency: string
  rating?: number | null
  brand?: {
    name: string
    slug: string
  } | null
}

interface GuideSidebarProps {
  guide: {
    id: string
    title: string
    category?: {
      id: string
      name: string
      slug: string
    } | null
    guideProducts: Array<{
      id: string
      product: Product
    }>
  }
  recommendedProducts: Product[]
}

export function GuideSidebar({ guide, recommendedProducts }: GuideSidebarProps) {
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Top Products */}
      {recommendedProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Top Picks
          </h3>
          <div className="space-y-3">
            {recommendedProducts.slice(0, 5).map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span className="text-sm font-bold text-blue-600 w-5">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </p>
                  {product.brand && (
                    <p className="text-xs text-gray-500">{product.brand.name}</p>
                  )}
                </div>
                {product.price && (
                  <span className="text-xs font-bold text-blue-600">
                    {formatPrice(product.price, product.currency)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Link */}
      {guide.category && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-2">Related Category</h3>
          <Link
            href={`/categories/${guide.category.slug}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <BookOpen className="h-4 w-4" />
            {guide.category.name}
          </Link>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-3">Quick Tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Read product reviews before buying</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Compare prices across retailers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Check return policies and warranties</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Look for verified customer feedback</span>
          </div>
        </div>
      </div>
    </div>
  )
}
