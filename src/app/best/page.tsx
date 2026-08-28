// src/app/best/page.tsx
import Link from "next/link"
import { bestOfService } from "@/services"
import { Star, Calendar, User } from "lucide-react"

export const metadata = {
  title: "Best Of - Top Product Lists",
  description: "Curated lists of the best products in every category",
}

export default async function BestOfPage() {
  const { data: bestOfs, total } = await bestOfService.getAll({
    status: "PUBLISHED",
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Best Of</h1>
        <p className="text-gray-600 mb-8">Curated lists of the best products in every category</p>

        {bestOfs && bestOfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestOfs.map((bestOf) => (
              <Link
                key={bestOf.id}
                href={`/best/${bestOf.slug}`}
                className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {bestOf.title}
                      </h3>
                      {bestOf.category && (
                        <p className="text-sm text-gray-500">{bestOf.category.name}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <span>{bestOf.entries.length} products</span>
                      </div>
                    </div>
                  </div>

                  {bestOf.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {bestOf.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    {bestOf.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {bestOf.author.name || "Anonymous"}
                      </span>
                    )}
                    {bestOf.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(bestOf.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No Best Of lists available yet.</p>
          </div>
        )}

        {total > 12 && (
          <div className="mt-8 text-center">
            <Link
              href="/best?page=2"
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
