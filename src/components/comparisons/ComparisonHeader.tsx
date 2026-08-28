// src/components/comparisons/ComparisonHeader.tsx
import { GitCompare } from "lucide-react"

interface ComparisonHeaderProps {
  comparison: {
    id: string
    title: string
    excerpt?: string | null
    products: Array<{
      product: {
        id: string
        name: string
        slug: string
        brand?: {
          name: string
          slug: string
        } | null
      }
    }>
    publishedAt?: Date | null
    views: number
  }
}

export function ComparisonHeader({ comparison }: ComparisonHeaderProps) {
  const productNames = comparison.products
    .map((cp) => cp.product.name)
    .join(" vs ")

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg">
          <GitCompare className="h-6 w-6 text-blue-600" />
        </div>
        <span className="text-sm text-blue-600 font-medium">Comparison</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold">{comparison.title}</h1>
      
      <p className="text-sm text-gray-500 mt-2">{productNames}</p>

      {comparison.excerpt && (
        <p className="text-gray-600 mt-4">{comparison.excerpt}</p>
      )}

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
        {comparison.publishedAt && (
          <span>
            Updated: {new Date(comparison.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
        {comparison.views > 0 && (
          <span>{comparison.views} views</span>
        )}
      </div>
    </div>
  )
}
