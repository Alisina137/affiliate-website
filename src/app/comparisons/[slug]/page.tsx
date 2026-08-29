// src/app/comparisons/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { comparisonService } from "@/services"
import { ComparisonTable } from "@/components/comparisons/ComparisonTable"
import { ComparisonHeader } from "@/components/comparisons/ComparisonHeader"
import { ComparisonWinner } from "@/components/comparisons/ComparisonWinner"
import { ArrowLeft } from "lucide-react"

interface ComparisonPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ComparisonPageProps) {
  const { slug } = await params
  const comparison = await comparisonService.getBySlug(slug)

  if (!comparison) {
    return {
      title: "Comparison Not Found",
    }
  }

  return {
    title: comparison.seoTitle || `${comparison.title} - Comparison`,
    description: comparison.metaDescription || comparison.excerpt || `Compare products side by side`,
  }
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params
  const comparison = await comparisonService.getBySlug(slug)

  if (!comparison) {
    notFound()
  }

  // Extract products from comparison and properly type them
  const products = comparison.products.map((cp) => ({
    ...cp.product,
    specifications: cp.product.specifications as Record<string, string | number | boolean | null> | null,
    features: cp.product.features as string[] | null,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/comparisons" className="hover:text-blue-600">Comparisons</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{comparison.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/comparisons"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Comparisons
        </Link>

        {/* Comparison Header */}
        <ComparisonHeader comparison={comparison} />

        {/* Winner Section */}
        {comparison.winner && (
          <div className="mt-8">
            <ComparisonWinner
              winner={comparison.winner}
              explanation={comparison.winnerExplanation}
              products={products}
              comparisonProducts={comparison.products}
            />
          </div>
        )}

        {/* Comparison Table */}
        <div className="mt-8">
          <ComparisonTable
            comparison={comparison}
            products={products}
          />
        </div>

        {/* Full Content */}
        {comparison.content && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Detailed Analysis</h2>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: comparison.content }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
