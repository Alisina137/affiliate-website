// src/components/products/ProductReviews.tsx
"use client"

import { Star, User } from "lucide-react"

interface Review {
  id: string
  title: string
  content?: string | null
  rating?: number | null
  pros: string[]
  cons: string[]
  verdict?: string | null
  author: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: Date
}

interface ProductReviewsProps {
  reviews: Review[]
  productName: string
}

export function ProductReviews({ reviews, productName }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        {averageRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold ml-1">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{review.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {review.rating && review.rating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{review.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{review.author.name || "Anonymous"}</span>
              </div>
            </div>

            {review.content && (
              <p className="text-sm text-gray-600 mt-2">{review.content}</p>
            )}

            {review.verdict && (
              <p className="text-sm font-medium text-blue-600 mt-2">Verdict: {review.verdict}</p>
            )}

            {(review.pros.length > 0 || review.cons.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                {review.pros.length > 0 && (
                  <div>
                    <span className="text-green-600 font-medium">Pros:</span>
                    <span className="text-gray-600"> {review.pros.join(", ")}</span>
                  </div>
                )}
                {review.cons.length > 0 && (
                  <div>
                    <span className="text-red-600 font-medium">Cons:</span>
                    <span className="text-gray-600"> {review.cons.join(", ")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
