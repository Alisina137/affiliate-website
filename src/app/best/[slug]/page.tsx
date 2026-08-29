// src/app/best/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { bestOfService } from "@/services"
import { BestOfHeader } from "@/components/bestof/BestOfHeader"
import { BestOfEntries } from "@/components/bestof/BestOfEntries"
import { BestOfSidebar } from "@/components/bestof/BestOfSidebar"
import { ArrowLeft } from "lucide-react"

interface BestOfPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BestOfPageProps) {
  const { slug } = await params
  const bestOf = await bestOfService.getBySlug(slug)

  if (!bestOf) {
    return {
      title: "Best Of Not Found",
    }
  }

  return {
    title: bestOf.seoTitle || `${bestOf.title}`,
    description: bestOf.metaDescription || bestOf.excerpt || `The best products curated for you`,
  }
}

export default async function BestOfPage({ params }: BestOfPageProps) {
  const { slug } = await params
  const bestOf = await bestOfService.getBySlug(slug)

  if (!bestOf) {
    notFound()
  }

  // Get top 3 entries for sidebar
  const topEntries = bestOf.entries.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/best" className="hover:text-blue-600">Best Of</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{bestOf.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/best"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Best Of
        </Link>

        {/* Best Of Header */}
        <BestOfHeader bestOf={bestOf} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <BestOfEntries entries={bestOf.entries} />
          </div>
          <div className="lg:col-span-1">
            <BestOfSidebar
              entries={topEntries}
              category={bestOf.category}
            />
          </div>
        </div>

        {/* Full Content */}
        {bestOf.content && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">More Information</h2>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: bestOf.content }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
