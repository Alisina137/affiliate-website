// src/app/products/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { productService } from "@/services"
import { ProductSummary } from "@/components/products/ProductSummary"
import { ProductSpecifications } from "@/components/products/ProductSpecifications"
import { ProductReviews } from "@/components/products/ProductReviews"
import { RelatedProducts } from "@/components/products/RelatedProducts"
import { ProductAffiliateCTA } from "@/components/products/ProductAffiliateCTA"
import { ArrowLeft } from "lucide-react"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await productService.getBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description || `Buy ${product.name}`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await productService.getBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProducts = await productService.getRelated(product.id, product.categoryId || undefined)

  // Convert specifications to the proper type
  const rawSpecifications = product.specifications as Record<string, unknown> | null
  const specifications: Record<string, { value: string; type?: string }> = {}
  
  if (rawSpecifications) {
    Object.keys(rawSpecifications).forEach((key) => {
      const value = rawSpecifications[key]
      if (value !== null && value !== undefined) {
        specifications[key] = {
          value: String(value),
          type: typeof value === "string" && value.startsWith("http") ? "url" : "text"
        }
      }
    })
  }

  const category = product.category as { id: string; name: string; slug: string } | null
  const reviews = product.reviews || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/categories/${category.slug}`} className="hover:text-blue-600">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href={category ? `/categories/${category.slug}` : "/categories"}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {category?.name || "Categories"}
        </Link>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductSummary product={product} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductAffiliateCTA product={product} />
            </div>
          </div>
        </div>

        {/* Specifications */}
        {Object.keys(specifications).length > 0 && (
          <div className="mt-12">
            <ProductSpecifications specifications={specifications} />
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-12">
            <ProductReviews reviews={reviews} />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
// src/app/products/[slug]/page.tsx (update the page)

// Add revalidation
export const revalidate = 3600 // Revalidate every hour
export const dynamic = "force-static" // Force static generation

// For dynamic content that needs fresh data:
// export const dynamic = "auto" // Auto-detect
