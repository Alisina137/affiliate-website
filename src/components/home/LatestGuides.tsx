// src/components/home/LatestGuides.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"

interface Guide {
  id: string
  title: string
  slug: string
  excerpt: string
  introduction: string
  authorName: string
  publishedAt: string
}

export function LatestGuides() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/guides?limit=3")
      .then(res => res.json())
      .then(data => {
        setGuides(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setGuides([
          {
            id: "1",
            title: "How to Choose a Laptop",
            slug: "how-to-choose-a-laptop",
            excerpt: "Everything you need to know before buying a laptop.",
            introduction: "Choosing the right laptop can be overwhelming...",
            authorName: "John Doe",
            publishedAt: "2026-08-22"
          },
          {
            id: "2",
            title: "The Ultimate Guide to Wireless Headphones",
            slug: "ultimate-guide-wireless-headphones",
            excerpt: "Find the perfect headphones for your lifestyle.",
            introduction: "Wireless headphones have come a long way...",
            authorName: "Sarah Lee",
            publishedAt: "2026-08-18"
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
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Latest Guides</h2>
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

  if (guides.length === 0) return null

  return (
    <section className="py-16 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Latest Guides</h2>
            <p className="text-gray-500 text-sm mt-1">Expert buying advice</p>
          </div>
          <Link href="/guides" className="text-sm text-[#1a1a2e] hover:underline flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="group border border-gray-200/60 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-[#1a1a2e]" />
                <span className="text-xs text-gray-400">Guide</span>
              </div>
              <h3 className="font-medium text-[#1a1a2e] group-hover:text-[#1a1a2e]/70 transition-colors line-clamp-2">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{guide.excerpt || guide.introduction}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>{guide.authorName}</span>
                <span>•</span>
                <span>{new Date(guide.publishedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
