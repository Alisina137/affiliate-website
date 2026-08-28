// src/components/brands/BrandSidebar.tsx
import Link from "next/link"
import { Award, TrendingUp, Clock, Star, Building2, ExternalLink } from "lucide-react"

interface BrandSidebarProps {
  brand: {
    id: string
    name: string
    slug: string
    description?: string | null
    logo?: string | null
    website?: string | null
    foundedYear?: number | null
    headquarters?: string | null
    categories?: Array<{
      id: string
      name: string
      slug: string
    }>
    niche?: {
      id: string
      name: string
      slug: string
    } | null
  }
}

export function BrandSidebar({ brand }: BrandSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Brand Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-3">About {brand.name}</h3>
        {brand.description && (
          <p className="text-sm text-gray-600">{brand.description}</p>
        )}
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          {brand.foundedYear && (
            <div className="flex justify-between">
              <span>Founded</span>
              <span className="font-medium">{brand.foundedYear}</span>
            </div>
          )}
          {brand.headquarters && (
            <div className="flex justify-between">
              <span>Headquarters</span>
              <span className="font-medium">{brand.headquarters}</span>
            </div>
          )}
          {brand.website && (
            <div className="flex justify-between">
              <span>Website</span>
              <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {brand.website.replace(/^https?:\/\//, '')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      {brand.categories && brand.categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {brand.categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose This Brand */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-3">Why Choose {brand.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Quality products</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-500" />
            <span>Trusted brand</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Industry leader</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>Reliable products</span>
          </div>
        </div>
      </div>

      {/* Related Niche */}
      {brand.niche && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-2">Related Niche</h3>
          <Link
            href={`/niches/${brand.niche.slug}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Building2 className="h-4 w-4" />
            {brand.niche.name}
          </Link>
        </div>
      )}
    </div>
  )
}
