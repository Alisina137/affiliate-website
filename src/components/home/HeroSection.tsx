// src/components/home/HeroSection.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Star, Shield, Zap } from "lucide-react"

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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">⭐ Trusted by 10,000+ readers</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up-delay-1 text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Find the Best
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Products for You
            </span>
          </h1>

          {/* Description */}
          <p className="animate-fade-in-up-delay-2 text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Discover honest reviews, side-by-side comparisons, and expert buying guides to make informed decisions.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-fade-in-up-delay-3 max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, reviews, or guides..."
                  className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {isLoading ? "Searching..." : "Search"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="animate-fade-in-up-delay-3 flex flex-wrap justify-center gap-2 text-sm text-blue-200">
            <span>Popular:</span>
            {["Gaming Laptops", "Wireless Earbuds", "Smartphones", "Running Shoes"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term)
                  router.push(`/search?q=${encodeURIComponent(term)}`)
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="animate-fade-in-up-delay-3 mt-12 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Trusted Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
