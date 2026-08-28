// src/components/bestof/BestOfHeader.tsx
import { Star, Award, Users, Calendar } from "lucide-react"
import Link from "next/link"

interface BestOfHeaderProps {
  bestOf: {
    id: string
    title: string
    introduction?: string | null
    excerpt?: string | null
    category?: {
      id: string
      name: string
      slug: string
    } | null
    entries: Array<{
      id: string
      order: number
    }>
    publishedAt?: Date | null
    views: number
    author?: {
      id: string
      name: string | null
    } | null
  }
}

export function BestOfHeader({ bestOf }: BestOfHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200 p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-yellow-400 p-2 rounded-lg">
          <Star className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wider">Best Of</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold">{bestOf.title}</h1>
      
      {bestOf.introduction && (
        <p className="text-gray-600 mt-4 max-w-3xl">{bestOf.introduction}</p>
      )}

      {bestOf.excerpt && (
        <p className="text-gray-500 mt-2 text-sm">{bestOf.excerpt}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
        {bestOf.category && (
          <Link 
            href={`/categories/${bestOf.category.slug}`}
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <Award className="h-4 w-4" />
            {bestOf.category.name}
          </Link>
        )}
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {bestOf.entries.length} products compared
        </span>
        {bestOf.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Updated: {new Date(bestOf.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
        {bestOf.views > 0 && (
          <span>{bestOf.views} views</span>
        )}
      </div>
    </div>
  )
}
