// src/components/home/HeroSection.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length > 0) {
      setIsLoading(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="bg-[#f8f9fa] border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a2e] mb-3 sm:mb-4">
            Find the best <br />
            <span className="text-[#1a1a2e]/60">products, faster.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl leading-relaxed">
            Research, compare, and discover the right products for you.
            Curated by experts. Trusted by thousands.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="flex flex-col sm:flex-row items-stretch bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1a1a2e] focus-within:ring-1 focus-within:ring-[#1a1a2e] transition-all search-shadow">
              <div className="flex items-center px-3 sm:px-4">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-2 sm:px-3 py-3 sm:py-4 text-sm sm:text-base text-[#1a1a2e] placeholder-gray-400 focus:outline-none min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 sm:px-6 py-3 sm:py-4 bg-[#1a1a2e] text-white font-medium hover:bg-[#2d2d44] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px] sm:min-h-[56px] btn-primary"
              >
                {isLoading ? "Searching" : "Search"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <span className="text-gray-500">Popular:</span>
            {["Gaming Laptops", "Wireless Earbuds", "Smartphones"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term)
                  router.push(`/search?q=${encodeURIComponent(term)}`)
                }}
                className="text-gray-500 hover:text-[#1a1a2e] transition-colors py-1 px-2 touch-target"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
