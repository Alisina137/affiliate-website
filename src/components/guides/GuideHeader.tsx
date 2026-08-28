// src/components/guides/GuideHeader.tsx
import { BookOpen, Clock, User, Calendar } from "lucide-react"
import Link from "next/link"

interface GuideHeaderProps {
  guide: {
    id: string
    title: string
    introduction?: string | null
    excerpt?: string | null
    category?: {
      id: string
      name: string
      slug: string
    } | null
    featured: boolean
    publishedAt?: Date | null
    views: number
    author?: {
      id: string
      name: string | null
      image: string | null
    } | null
    guideProducts: Array<{
      id: string
      product: {
        id: string
        name: string
      }
    }>
  }
}

export function GuideHeader({ guide }: GuideHeaderProps) {
  const readingTime = Math.ceil(
    (guide.introduction?.length || 0) / 1000 + 
    (guide.excerpt?.length || 0) / 1000 + 5
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Buying Guide</span>
        {guide.featured && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold">{guide.title}</h1>
      
      {guide.introduction && (
        <p className="text-gray-600 mt-4 text-lg">{guide.introduction}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
        {guide.author && (
          <div className="flex items-center gap-2">
            {guide.author.image && (
              <img 
                src={guide.author.image} 
                alt={guide.author.name || "Author"} 
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{guide.author.name || "Anonymous"}</span>
          </div>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {readingTime} min read
        </span>
        {guide.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(guide.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
        {guide.views > 0 && (
          <span>{guide.views} views</span>
        )}
      </div>
    </div>
  )
}
