"use client"

import { Star, Check, X, ThumbsUp, Share2, Bookmark } from "lucide-react"

interface Review {
  id: string
  title: string
  content?: string | null
  excerpt?: string | null
  rating?: number | null
  pros: string[]
  cons: string[]
  verdict?: string | null
  bestFor?: string | null
  product?: {
    id: string
    name: string
    slug: string
    price?: number | null
    currency: string
    images: string[]
    affiliateLinks?: Array<{
      id: string
      url: string
      label: string
      merchant: string
    }>
  } | null
  author?: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  } | null
  publishedAt?: Date | null
}

interface ReviewContentProps {
  review: Review
}

export function ReviewContent({ review }: ReviewContentProps) {
  const renderContent = () => {
    if (!review.content) return null

    if (review.content.includes("<") || review.content.includes(">")) {
      return <div dangerouslySetInnerHTML={{ __html: review.content }} />
    }

    const paragraphs = review.content.split("\n\n").filter(p => p.trim())
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-700 leading-relaxed mb-4">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Rating Summary</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-bold">{review.rating?.toFixed(1) || "N/A"}</span>
            <span className="text-sm text-gray-500">/ 5.0</span>
          </div>
          {review.bestFor && (
            <div className="border-l pl-6">
              <p className="text-sm text-gray-500">Best For</p>
              <p className="font-medium">{review.bestFor}</p>
            </div>
          )}
        </div>
      </div>

      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {review.pros?.length > 0 && (
            <div className="bg-green-50 rounded-lg border border-green-100 p-6">
              <h3 className="font-semibold text-green-800 text-lg mb-3 flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                Pros
              </h3>
              <ul className="space-y-2">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-700">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-100 p-6">
              <h3 className="font-semibold text-red-800 text-lg mb-3 flex items-center gap-2">
                <X className="h-5 w-5" />
                Cons
              </h3>
              <ul className="space-y-2">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {review.verdict && (
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-6">
          <h3 className="font-semibold text-blue-800 text-lg mb-2">Verdict</h3>
          <p className="text-blue-700">{review.verdict}</p>
        </div>
      )}

      {review.content && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Full Review</h2>
          <div className="prose prose-sm max-w-none">
            {renderContent()}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <ThumbsUp className="h-4 w-4" />
          Helpful
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  )
}
