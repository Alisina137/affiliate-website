// src/components/home/BestOfSection.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"

interface BestOf {
  id: string
  title: string
  slug: string
  excerpt: string
  entries: { product: { name: string } }[]
}

export function BestOfSection() {
  const [bestOf, setBestOf] = useState<BestOf[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/best?limit=3")
      .then(res => res.json())
      .then(data => {
        setBestOf(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setBestOf([
          {
            id: "1",
            title: "Best Gaming Laptops",
            slug: "best-gaming-laptops",
            excerpt: "Top gaming laptops for every budget.",
            entries: [
              { product: { name: "ASUS ROG Zephyrus" } },
              { product: { name: "MSI Stealth" } }
            ]
          },
          {
            id: "2",
            title: "Best Wireless Headphones",
            slug: "best-wireless-headphones",
            excerpt: "The best wireless headphones in 2026.",
            entries: [
              { product: { name: "Sony WH-1000XM5" } },
              { product: { name: "Bose QC45" } }
            ]
          }
        ])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Best Of</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (bestOf.length === 0) return null

  return (
    <section className="py-16 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Best Of</h2>
            <p className="text-gray-500 text-sm mt-1">Curated top product lists</p>
          </div>
          <Link href="/best" className="text-sm text-[#1a1a2e] hover:underline flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestOf.map((item) => (
            <Link
              key={item.id}
              href={`/best/${item.slug}`}
              className="group border border-gray-200/60 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-[#1a1a2e]" />
                <span className="text-xs text-gray-400">Best Of</span>
              </div>
              <h3 className="font-medium text-[#1a1a2e] group-hover:text-[#1a1a2e]/70 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>{item.entries.map(e => e.product.name).join(", ")}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
