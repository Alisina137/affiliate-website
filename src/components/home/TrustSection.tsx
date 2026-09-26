"use client"

import { useEffect, useState } from "react"
import { Shield, Clock, Heart, Search } from "lucide-react"

type Stats = { products: number; reviews: number; comparisons: number; guides: number }

export function TrustSection() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/stats", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Stats unavailable")
        return res.json()
      })
      .then((data) => setStats({
        products: Number(data.totalProducts) || 0,
        reviews: Number(data.totalReviews) || 0,
        comparisons: Number(data.totalComparisons) || 0,
        guides: Number(data.totalGuides) || 0,
      }))
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") setStats(null)
      })
    return () => controller.abort()
  }, [])

  const trustItems = [
    { icon: Shield, title: "Independent guidance", body: "Recommendations are designed to help readers make informed choices." },
    { icon: Search, title: "Research focused", body: "We organize product information, comparisons, and buying guidance." },
    { icon: Clock, title: "Built to stay useful", body: "Published content can be reviewed and updated as information changes." },
    { icon: Heart, title: "Reader first", body: "Clear comparisons and practical guidance come before unnecessary complexity." },
  ]

  return (
    <section className="border-b border-gray-200/60 bg-white py-12 sm:py-16" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Why Affiliate</p>
          <h2 id="trust-heading" className="mt-2 text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl">Research that is easier to use</h2>
        </div>

        {stats && Object.values(stats).some((value) => value > 0) && (
          <dl className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              ["Products", stats.products],
              ["Reviews", stats.reviews],
              ["Comparisons", stats.comparisons],
              ["Guides", stats.guides],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <dd className="text-2xl font-bold text-[#1a1a2e] sm:text-3xl">{value}</dd>
                <dt className="mt-1 text-sm text-gray-500">{label}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
              <Icon className="mb-4 h-5 w-5 text-[#1a1a2e]" aria-hidden="true" />
              <h3 className="font-semibold text-[#1a1a2e]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
