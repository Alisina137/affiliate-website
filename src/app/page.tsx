// src/app/page.tsx
import { Header, Footer } from "@/components/layout"
import { HeroSection } from "@/components/home"
import { HomeContent } from "@/components/home/HomeContent"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        {/* Content Sections */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <HomeContent />
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <NewsletterSignup />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
