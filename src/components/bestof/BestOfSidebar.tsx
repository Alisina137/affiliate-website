// src/components/bestof/BestOfSidebar.tsx
import Link from "next/link"
import { Award, TrendingUp, Clock, ShoppingCart, Star } from "lucide-react"

interface Entry {
  id: string
  order: number
  product: {
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
}

interface BestOfSidebarProps {
  entries: Entry[]
  category?: {
    id: string
    name: string
    slug: string
  } | null
  title: string
}

export function BestOfSidebar({ entries, category, title }: BestOfSidebarProps) {
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          Top Picks
        </h3>
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const medals = ["🥇", "🥈", "🥉"]
            return (
              <Link
                key={entry.id}
                href={`/products/${entry.product.slug}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span className="text-lg">{medals[index] || `#${index + 1}`}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                    {entry.product.name}
                  </p>
                  {entry.product.brand && (
                    <p className="text-xs text-gray-500">{entry.product.brand.name}</p>
                  )}
                </div>
                {entry.product.price && (
                  <span className="text-xs font-bold text-blue-600">
                    {formatPrice(entry.product.price, entry.product.currency)}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Category Link */}
      {category && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-2">Browse Category</h3>
          <Link
            href={`/categories/${category.slug}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Award className="h-4 w-4" />
            {category.name}
          </Link>
        </div>
      )}

      {/* Why Trust Us */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-3">Why Trust Us</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Expert reviews and analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Up-to-date product information</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Regularly updated lists</span>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-purple-500" />
            <span>Best price comparison</span>
          </div>
        </div>
      </div>
    </div>
  )
}
