// src/components/home/HeroSection.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Zap } from "lucide-react"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length > 0 && !isLoading) {
      setIsLoading(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#07101f] text-white"
      aria-labelledby="home-hero-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(37,99,235,0.18),transparent_38%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:px-8 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Trusted electronics guides
          </div>

          <h1 id="home-hero-title" className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the Best{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Electronics for You
            </span>
          </h1>

          <p className="mb-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Research, compare, and discover the right electronics with in-depth reviews and practical buying guides.
            Make smarter decisions and find better value without the guesswork.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl" role="search">
            <div className="flex flex-col overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl shadow-blue-950/30 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30 sm:flex-row">
              <div className="flex flex-1 items-center px-4">
                <Search className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Search electronics, reviews and buying guides"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search electronics, reviews, or guides..."
                  className="min-h-[54px] w-full px-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-[52px] items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="mr-1 text-slate-400">Popular:</span>
            {["Gaming Laptops", "Wireless Earbuds", "Smartphones"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term)
                  router.push(`/search?q=${encodeURIComponent(term)}`)
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300 transition-colors hover:border-blue-400/50 hover:bg-blue-400/10 hover:text-white"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[680px] items-center justify-center lg:max-w-none" aria-hidden="true">
          <div className="absolute h-[70%] w-[70%] rounded-full bg-blue-500/20 blur-3xl" />
          <Image
            src="/images/electronics-hologram.png"
            alt=""
            width={900}
            height={700}
            priority
            className="relative h-auto w-full select-none rounded-2xl object-contain mix-blend-screen drop-shadow-[0_0_34px_rgba(59,130,246,0.32)]"
          />
        </div>
      </div>
    </section>
  )
}
