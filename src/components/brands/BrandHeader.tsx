// src/components/brands/BrandHeader.tsx
import { Building2, Star, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BrandStats {
  productCount: number
  categoryCount: number
  reviewCount: number
  averageRating: number
}

interface BrandHeaderProps {
  brand: {
    id: string
    name: string
    slug: string
    description?: string | null
    logo?: string | null
    website?: string | null
    foundedYear?: number | null
    headquarters?: string | null
    niche?: {
      id: string
      name: string
      slug: string
    } | null
  }
  stats: BrandStats
}

export function BrandHeader({ brand, stats }: BrandHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Logo */}
        <div className="shrink-0">
          {brand.logo ? (
            <div className="relative h-20 w-20">
              <Image 
                src={brand.logo} 
                alt={brand.name} 
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{brand.name}</h1>
          {brand.description && (
            <p className="text-gray-600 mt-2">{brand.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            {brand.foundedYear && (
              <span>Founded: {brand.foundedYear}</span>
            )}
            {brand.headquarters && (
              <span>📍 {brand.headquarters}</span>
            )}
            {brand.niche && (
              <Link 
                href={`/niches/${brand.niche.slug}`}
                className="text-blue-600 hover:underline"
              >
                {brand.niche.name}
              </Link>
            )}
            {brand.website && (
              <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.productCount}</p>
          <p className="text-sm text-gray-500">Products</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.categoryCount}</p>
          <p className="text-sm text-gray-500">Categories</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.reviewCount}</p>
          <p className="text-sm text-gray-500">Reviews</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <p className="text-2xl font-bold text-blue-600">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>
      </div>
    </div>
  )
}
