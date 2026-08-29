// src/components/statistics/StatisticHeader.tsx

import Image from "next/image"
import { BarChart3, Calendar, FileText } from "lucide-react"

interface StatisticHeaderProps {
  statistic: {
    id: string
    title: string
    excerpt?: string | null
    publishedAt?: Date | null
    views: number
    sources: string[]
    author?: {
      id: string
      name: string | null
      image: string | null
    } | null
    niche?: {
      id: string
      name: string
      slug: string
    } | null
  }
}

export function StatisticHeader({ statistic }: StatisticHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-50 p-2 rounded-lg">
          <BarChart3 className="h-6 w-6 text-purple-600" />
        </div>

        <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
          Research &amp; Data
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold">
        {statistic.title}
      </h1>

      {statistic.excerpt && (
        <p className="text-gray-600 mt-4 text-lg">
          {statistic.excerpt}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
        {statistic.author && (
          <div className="flex items-center gap-2">
            {statistic.author.image && (
              <Image
                src={statistic.author.image}
                alt={statistic.author.name || "Author"}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}

            <span>
              {statistic.author.name || "Anonymous"}
            </span>
          </div>
        )}

        {statistic.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />

            {new Date(statistic.publishedAt).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </span>
        )}

        {statistic.views > 0 && (
          <span>{statistic.views} views</span>
        )}

        {statistic.sources && statistic.sources.length > 0 && (
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {statistic.sources.length} sources
          </span>
        )}
      </div>
    </div>
  )
}