// src/app/statistics/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { statisticService } from "@/services"
import { StatisticContent } from "@/components/statistics/StatisticContent"
import { StatisticHeader } from "@/components/statistics/StatisticHeader"
import { StatisticSidebar } from "@/components/statistics/StatisticSidebar"
import { ArrowLeft } from "lucide-react"

interface StatisticPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: StatisticPageProps) {
  const { slug } = await params
  const statistic = await statisticService.getBySlug(slug)

  if (!statistic) {
    return {
      title: "Statistics Not Found",
    }
  }

  return {
    title: statistic.seoTitle || `${statistic.title}`,
    description: statistic.metaDescription || statistic.excerpt || `Key statistics and research data`,
  }
}

export default async function StatisticPage({ params }: StatisticPageProps) {
  const { slug } = await params
  const statistic = await statisticService.getBySlug(slug)

  if (!statistic) {
    notFound()
  }

  // Transform statistic data with proper typing
  const typedStatistic = {
    ...statistic,
    data: statistic.data as any
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/statistics" className="hover:text-blue-600">Statistics</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{statistic.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/statistics"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Statistics
        </Link>

        {/* Statistic Header */}
        <StatisticHeader statistic={typedStatistic} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <StatisticContent statistic={typedStatistic} />
          </div>
          <div className="lg:col-span-1">
            <StatisticSidebar statistic={typedStatistic} />
          </div>
        </div>
      </div>
    </div>
  )
}
