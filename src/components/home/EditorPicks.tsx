// src/components/home/EditorPicks.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Sparkles, ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  image: string
  brand: { name: string }
  excerpt: string
}

export function EditorPicks() {
  const [picks, setPicks] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products/editor-picks")
      .then(res => res.json())
      .then(data => {
        setPicks(data.slice(0, 3))
        setLoading(false)
      })
      .catch(() => {
        setPicks([
          {
            id: "1",
            name: "MacBook Pro 16-inch",
            slug: "macbook-pro-16",
            price: 2499,
            currency: "USD",
            rating: 4.9,
            reviewCount: 156,
            image: "",
            brand: { name: "Apple" },
            excerpt: "The ultimate creative powerhouse with incredible performance."
          },
          {
            id: "2",
            name: "Sony WH-1000XM5",
            slug: "sony-wh-1000xm5",
            price: 399,
            currency: "USD",
            rating: 4.8,
            reviewCount: 234,
            image: "",
            brand: { name: "Sony" },
            excerpt: "Industry-leading noise cancellation with exceptional sound quality."
          }
        ])
        setLoading(false)
      })
  }, [])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(price)
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">Editor's Picks</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Our Favorite Products Right Now</h2>
            <p className="text-gray-500 mt-1">Hand-picked by our expert team</p>
          </div>
          <Link href="/best" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {picks.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
            >
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  🏆 Top Pick
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{product.brand.name}</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-xs text-gray-400">{product.reviewCount} reviews</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
