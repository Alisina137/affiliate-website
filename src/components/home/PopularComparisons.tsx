// src/components/home/PopularComparisons.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GitCompare, ArrowRight } from "lucide-react"

interface Comparison {
  id: string
  title: string
  slug: string
  excerpt: string
  products: { product: { name: string } }[]
  winner: string
}

export function PopularComparisons() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/comparisons?limit=3")
      .then(res => res.json())
      .then(data => {
        setComparisons(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setComparisons([
          {
            id: "1",
            title: "MacBook Pro vs Dell XPS",
            slug: "macbook-pro-vs-dell-xps",
            excerpt: "Which premium laptop comes out on top?",
            products: [
              { product: { name: "MacBook Pro" } },
              { product: { name: "Dell XPS" } }
            ],
            winner: "MacBook Pro"
          },
          {
            id: "2",
            title: "AirPods Pro vs Sony WF-1000XM5",
            slug: "airpods-pro-vs-sony",
            excerpt: "The ultimate wireless earbud showdown.",
            products: [
              { product: { name: "AirPods Pro" } },
              { product: { name: "Sony WF-1000XM5" } }
            ],
            winner: "Sony WF-1000XM5"
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
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Popular Comparisons</h2>
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

  if (comparisons.length === 0) return null

  return (
    <section className="py-16 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Popular Comparisons</h2>
            <p className="text-gray-500 text-sm mt-1">Side-by-side product analysis</p>
          </div>
          <Link href="/comparisons" className="text-sm text-[#1a1a2e] hover:underline flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisons.map((comparison) => (
            <Link
              key={comparison.id}
              href={`/comparisons/${comparison.slug}`}
              className="group border border-gray-200/60 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <GitCompare className="h-4 w-4 text-[#1a1a2e]" />
                <span className="text-xs text-gray-400">Comparison</span>
              </div>
              <h3 className="font-medium text-[#1a1a2e] group-hover:text-[#1a1a2e]/70 transition-colors line-clamp-2">
                {comparison.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{comparison.excerpt}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>{comparison.products.map(p => p.product.name).join(" vs ")}</span>
                {comparison.winner && (
                  <>
                    <span>•</span>
                    <span className="text-[#1a1a2e] font-medium">Winner: {comparison.winner}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
