// src/app/brands/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { brandService } from "@/services"
import { BrandHeader } from "@/components/brands/BrandHeader"
import { BrandProducts } from "@/components/brands/BrandProducts"
import { BrandSidebar } from "@/components/brands/BrandSidebar"
import { ArrowLeft } from "lucide-react"

interface BrandPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { slug } = await params
  const brand = await brandService.getBySlug(slug)

  if (!brand) {
    return {
      title: "Brand Not Found",
    }
  }

  return {
    title: `${brand.name} - Products & Reviews`,
    description: brand.description || `Browse ${brand.name} products and reviews`,
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params
  const brand = await brandService.getBySlug(slug)

  if (!brand) {
    notFound()
  }

  // Get brand statistics
  const stats = await brandService.getStats(brand.id)

  // Get first 12 products
  const { products, total } = await brandService.getProducts(brand.id, {
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/brands" className="hover:text-blue-600">Brands</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{brand.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/brands"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Link>

        {/* Brand Header */}
        <BrandHeader brand={brand} stats={stats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <BrandProducts 
              products={products} 
              total={total}
              brandSlug={brand.slug}
            />
          </div>
          <div className="lg:col-span-1">
            <BrandSidebar brand={brand} />
          </div>
        </div>
      </div>
    </div>
  )
}
