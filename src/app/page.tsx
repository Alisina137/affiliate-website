// src/app/page.tsx
import { Header, Footer } from "@/components/layout"
import { HeroSection } from "@/components/home/HeroSection"
import { TrustSection } from "@/components/home/TrustSection"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { RecentReviews } from "@/components/home/RecentReviews"
import { PopularComparisons } from "@/components/home/PopularComparisons"
import { LatestGuides } from "@/components/home/LatestGuides"
import { BestOfSection } from "@/components/home/BestOfSection"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Trust Signals */}
        <TrustSection />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Recent Reviews */}
        <RecentReviews />

        {/* Popular Comparisons */}
        <PopularComparisons />

        {/* Latest Guides */}
        <LatestGuides />

        {/* Best Of Section */}
        <BestOfSection />

        {/* Newsletter */}
        <section className="py-16 bg-[#1a1a2e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterSignup />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
