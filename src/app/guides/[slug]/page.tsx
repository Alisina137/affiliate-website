// src/app/guides/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { guideService } from "@/services"
import { GuideContent } from "@/components/guides/GuideContent"
import { GuideSidebar } from "@/components/guides/GuideSidebar"
import { GuideHeader } from "@/components/guides/GuideHeader"
import { ArrowLeft } from "lucide-react"

interface GuidePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = await guideService.getBySlug(slug)

  if (!guide) {
    return {
      title: "Guide Not Found",
    }
  }

  return {
    title: guide.seoTitle || `${guide.title} - Guide`,
    description: guide.metaDescription || guide.excerpt || `Learn how to choose the best products`,
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = await guideService.getBySlug(slug)

  if (!guide) {
    notFound()
  }

  // Get recommended products
  const recommendedProducts = guide.guideProducts.map((gp) => gp.product)

  // Transform guide data for GuideContent with proper typing
  const guideForContent = {
    id: guide.id,
    content: guide.content,
    tableOfContents: typeof guide.tableOfContents === 'string' 
      ? guide.tableOfContents 
      : guide.tableOfContents ? JSON.stringify(guide.tableOfContents) : null,
    guideProducts: guide.guideProducts.map((gp: any) => ({
      id: gp.id,
      context: gp.context,
      order: gp.order,
      product: gp.product,
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-blue-600">Guides</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{guide.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        {/* Guide Header */}
        <GuideHeader guide={guide} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <GuideContent guide={guideForContent} />
          </div>
          <div className="lg:col-span-1">
            <GuideSidebar
              guide={guide}
              recommendedProducts={recommendedProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
