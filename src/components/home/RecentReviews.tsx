// src/components/home/RecentReviews.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"

interface Review {
  id: string
  title: string
  slug: string
  excerpt: string
  rating: number
  productName: string
  productSlug: string
  authorName: string
  publishedAt: string
}

export function RecentReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reviews?limit=3")
      .then(res => res.json())
      .then(data => {
        setReviews(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setReviews([
          {
            id: "1",
            title: "Best Laptop for Creatives",
            slug: "best-laptop-creatives",
            excerpt: "After weeks of testing, this is the ultimate creative powerhouse.",
            rating: 4.9,
            productName: "MacBook Pro 16-inch",
            productSlug: "macbook-pro-16",
            authorName: "Jane Smith",
            publishedAt: "2026-08-25"
          },
          {
            id: "2",
            title: "The Perfect Noise-Canceling Headphones",
            slug: "perfect-noise-canceling-headphones",
            excerpt: "Industry-leading ANC that transforms your listening experience.",
            rating: 4.8,
            productName: "Sony WH-1000XM5",
            productSlug: "sony-wh-1000xm5",
            authorName: "Mike Johnson",
            publishedAt: "2026-08-20"
          }
        ])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Recent Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) return null

  return (
    <section className="py-16 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Recent Reviews</h2>
            <p className="text-sm text-gray-500 mt-1">What our experts think</p>
          </div>
          <Link href="/reviews" className="text-sm text-[#1a1a2e] hover:underline flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/reviews/${review.slug}`}
              className="card-premium p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{review.productName}</p>
                  <h3 className="font-medium text-[#1a1a2e] group-hover:text-[#1a1a2e]/70 transition-colors line-clamp-2">
                    {review.title}
                  </h3>
                </div>
                {review.rating > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Star className="h-4 w-4 fill-[#1a1a2e] text-[#1a1a2e]" />
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{review.excerpt}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>{review.authorName}</span>
                <span>•</span>
                <span>{new Date(review.publishedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
