// src/app/statistics/page.tsx
import Link from "next/link"
import { statisticService } from "@/services"
import { BarChart3, Calendar, User } from "lucide-react"

export const metadata = {
  title: "Statistics & Research",
  description: "Key statistics and research data for informed decision making",
}

export default async function StatisticsPage() {
  const { data: statistics, total } = await statisticService.getAll({
    status: "PUBLISHED",
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Statistics & Research</h1>
        <p className="text-gray-600 mb-8">Key statistics and research data for informed decision making</p>

        {statistics && statistics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics.map((statistic) => (
              <Link
                key={statistic.id}
                href={`/statistics/${statistic.slug}`}
                className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg shrink-0">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {statistic.title}
                      </h3>
                      {statistic.niche && (
                        <p className="text-sm text-gray-500">{statistic.niche.name}</p>
                      )}
                    </div>
                  </div>

                  {statistic.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {statistic.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    {statistic.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {statistic.author.name || "Anonymous"}
                      </span>
                    )}
                    {statistic.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(statistic.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No statistics available yet.</p>
          </div>
        )}

        {total > 12 && (
          <div className="mt-8 text-center">
            <Link
              href="/statistics?page=2"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Load More
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
