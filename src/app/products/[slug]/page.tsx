// src/app/products/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { productService } from "@/services"
import { ProductSummary } from "@/components/products/ProductSummary"
import { ProductSpecifications } from "@/components/products/ProductSpecifications"
import { ProductReviews } from "@/components/products/ProductReviews"
import { RelatedProducts } from "@/components/products/RelatedProducts"
import { ProductAffiliateCTA } from "@/components/products/ProductAffiliateCTA"
import { ProductComparisonSuggestion } from "@/components/products/ProductComparisonSuggestion"
import { ProductCategoryNav } from "@/components/products/ProductCategoryNav"
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

  // Get similar products for comparison (using the same related products)
  const similarProducts = relatedProducts || []

  const specifications = product.specifications as Record<string, unknown> | null
  const category = product.category as { id: string; name: string; slug: string } | null
  const reviews = product.reviews || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <ProductCategoryNav category={category} productName={product.name} />

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
        {specifications && Object.keys(specifications).length > 0 && (
          <div className="mt-12">
            <ProductSpecifications specifications={specifications} />
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-12">
            <ProductReviews reviews={reviews} productName={product.name} />
          </div>
        )}

        {/* Comparison Suggestion */}
        <ProductComparisonSuggestion product={product} similarProducts={similarProducts} />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-8">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
