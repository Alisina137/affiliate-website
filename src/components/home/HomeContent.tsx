// src/components/home/HomeContent.tsx
"use client"

import { useEffect, useState } from "react"
import { SectionHeader } from "./SectionHeader"
import { ProductCard } from "./ProductCard"
import { ReviewCard } from "./ReviewCard"

interface Product {
  id: string
  name: string
  slug: string
  image?: string | null
  price?: number | null
  currency?: string
  rating?: number | null
  reviewCount?: number
  brand?: {
    name: string
    slug: string
  } | null
}

interface Review {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  rating?: number | null
  productName: string
  productSlug: string
  authorName?: string | null
  publishedAt?: Date | null
}

export function HomeContent() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [popularReviews, setPopularReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        // Fetch featured products
        const productsRes = await fetch("/api/products?featured=true&limit=4")
        const productsData = await productsRes.json()
        setFeaturedProducts(productsData.data || [])

        // Fetch popular reviews
        const reviewsRes = await fetch("/api/reviews?status=PUBLISHED&limit=4&sortBy=views&sortOrder=desc")
        const reviewsData = await reviewsRes.json()
        setPopularReviews(reviewsData.data || [])
      } catch (error) {
        console.error("Error fetching home content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-gray-200 rounded-lg h-64" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Featured Products */}
      <section>
        <SectionHeader
          title="Featured Products"
          description="Hand-picked products for you"
          viewAllLink="/products"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              No featured products available
            </div>
          )}
        </div>
      </section>

      {/* Popular Reviews */}
      <section>
        <SectionHeader
          title="Popular Reviews"
          description="Most read reviews this month"
          viewAllLink="/reviews"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularReviews.length > 0 ? (
            popularReviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No reviews available
            </div>
          )}
        </div>
      </section>

      {/* Categories Showcase */}
      <section>
        <SectionHeader
          title="Browse Categories"
          description="Find products by category"
          viewAllLink="/categories"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Electronics", "Fashion", "Home & Garden", "Sports"].map((category) => (
            <div
              key={category}
              className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-medium">{category}</h3>
              <p className="text-xs text-gray-500 mt-1">Browse products</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
