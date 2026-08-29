// src/app/guides/page.tsx
import Link from "next/link"
import { guideService } from "@/services"
import { BookOpen, Calendar, User } from "lucide-react"

export const metadata = {
  title: "Buying Guides",
  description: "Expert guides to help you make informed purchasing decisions",
}

export default async function GuidesPage() {
  const { data: guides, total } = await guideService.getAll({
    status: "PUBLISHED",
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Buying Guides</h1>
        <p className="text-gray-600 mb-8">Expert guides to help you make informed purchasing decisions</p>

        {guides && guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      {guide.category && (
                        <p className="text-sm text-gray-500">{guide.category.name}</p>
                      )}
                    </div>
                  </div>

                  {guide.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {guide.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    {guide.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {guide.author.name || "Anonymous"}
                      </span>
                    )}
                    {guide.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(guide.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No guides available yet.</p>
          </div>
        )}

        {total > 12 && (
          <div className="mt-8 text-center">
            <Link
              href="/guides?page=2"
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
