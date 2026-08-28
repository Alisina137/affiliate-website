// src/app/reviews/page.tsx
import Link from "next/link"
import { reviewService } from "@/services"
import { ReviewRating } from "@/components/reviews"
import { Calendar, User } from "lucide-react"

export const metadata = {
  title: "Product Reviews",
  description: "Read in-depth product reviews and expert opinions",
}

export default async function ReviewsPage() {
  const { data: reviews, total } = await reviewService.getAll({
    status: "PUBLISHED",
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Product Reviews</h1>
        <p className="text-gray-600 mb-8">Read in-depth reviews and expert opinions</p>

        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/reviews/${review.slug}`}
                className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {review.title}
                      </h3>
                      {review.product && (
                        <p className="text-sm text-gray-500 mt-1">
                          {review.product.name}
                        </p>
                      )}
                    </div>
                    {review.rating && review.rating > 0 && (
                      <ReviewRating rating={review.rating} size="sm" />
                    )}
                  </div>

                  {review.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {review.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    {review.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {review.author.name || "Anonymous"}
                      </span>
                    )}
                    {review.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(review.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No reviews available yet.</p>
          </div>
        )}

        {total > 12 && (
          <div className="mt-8 text-center">
            <Link
              href="/reviews?page=2"
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
