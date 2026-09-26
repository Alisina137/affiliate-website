// src/components/home/HeroSection.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from "lucide-react"

const popularSearches = ["Laptops", "Smartphones", "Headphones", "Smartwatches"]

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const goToSearch = (query: string) => {
    if (!query.trim() || isLoading) return
    setIsLoading(true)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    goToSearch(searchQuery)
  }

  return (
    <section
      className="relative isolate overflow-hidden border-b border-white/[0.07] bg-[#050b16] text-white"
      aria-labelledby="home-hero-title"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#050b16_0%,#071222_46%,#08172b_72%,#050b16_100%)]" />
        <div className="absolute -right-[10%] -top-[25%] h-[720px] w-[720px] rounded-full bg-blue-600/[0.16] blur-[110px]" />
        <div className="absolute right-[12%] top-[18%] h-[420px] w-[420px] rounded-full bg-violet-600/[0.12] blur-[100px]" />
        <div className="absolute left-[22%] top-[8%] h-px w-[48%] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(148,163,184,0.55)_0.7px,transparent_0.7px)] [background-size:34px_34px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[660px] items-center gap-8 py-12 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-0 lg:py-20">
          <div className="relative z-20 max-w-[650px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/[0.07] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:text-xs">
              <ShieldCheck className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              Trusted electronics guides
            </div>

            <h1
              id="home-hero-title"
              className="max-w-[620px] text-[2.65rem] font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4rem]"
            >
              Find the Best{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Electronics
              </span>{" "}
              for You
            </h1>

            <p className="mt-6 max-w-[570px] text-base leading-7 text-slate-300 sm:text-[1.05rem]">
              In-depth reviews, thoughtful comparisons, and practical buying guides to help you choose technology with confidence.
            </p>

            <form onSubmit={handleSearch} className="mt-8 max-w-[590px]" role="search">
              <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.32)] transition-all focus-within:border-blue-400/70 focus-within:ring-4 focus-within:ring-blue-500/10 sm:flex-row">
                <div className="flex flex-1 items-center px-4">
                  <Search className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Search electronics, reviews and buying guides"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, reviews, or guides..."
                    className="min-h-[58px] w-full bg-transparent px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="m-1.5 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Searching..." : "Search"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="mr-1 text-slate-500">Popular searches</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  disabled={isLoading}
                  onClick={() => {
                    setSearchQuery(term)
                    goToSearch(term)
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-slate-300 transition hover:border-blue-400/40 hover:bg-blue-400/[0.08] hover:text-white disabled:opacity-50"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/[0.07] pt-5 text-xs text-slate-400 sm:text-sm">
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-400" />Independent research</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-violet-400" />Clear comparisons</span>
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[720px] items-center justify-center lg:-mr-10 lg:max-w-[760px]" aria-hidden="true">
            <div className="absolute inset-x-[7%] bottom-[5%] h-[24%] rounded-[50%] bg-blue-500/25 blur-[55px]" />
            <div className="absolute left-[13%] top-[16%] h-[46%] w-[46%] rounded-full bg-violet-500/[0.13] blur-[70px]" />
            <div className="absolute right-[4%] top-[18%] h-[50%] w-[50%] rounded-full bg-cyan-500/[0.12] blur-[80px]" />

            <div className="relative w-full overflow-hidden">
              <Image
                src="/images/electronics-hologram.png"
                alt=""
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 92vw, 52vw"
                className="relative h-auto w-full select-none object-contain contrast-[1.04] saturate-[1.08]"
              />
              <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#071222] via-[#071222]/55 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-[7%] bg-gradient-to-l from-[#06101e]/80 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-[#071222]/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-t from-[#06101e] via-[#06101e]/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050b16] to-transparent" aria-hidden="true" />
    </section>
  )
}
