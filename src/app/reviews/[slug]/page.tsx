// src/app/reviews/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { reviewService } from "@/services"
import { productService } from "@/services"
import { ReviewContent } from "@/components/reviews/ReviewContent"
import { ReviewSidebar } from "@/components/reviews/ReviewSidebar"
import { ReviewSchema } from "@/components/reviews/ReviewSchema"
import { BreadcrumbSchema, OrganizationSchema } from "@/components/seo"
import { ArrowLeft } from "lucide-react"

interface ReviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { slug } = await params
  const review = await reviewService.getBySlug(slug)

  if (!review) {
    return {
      title: "Review Not Found",
    }
  }

  return {
    title: review.seoTitle || `${review.title} - Review`,
    description: review.metaDescription || review.excerpt || `Read our in-depth review of ${review.product?.name}`,
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params
  const review = await reviewService.getBySlug(slug)

  if (!review) {
    notFound()
  }

  // Get related products for sidebar
  const relatedProducts = await productService.getRelated(
    review.productId,
    review.product?.categoryId || undefined,
    3
  )

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: "https://example.com" },
    { name: "Reviews", url: "https://example.com/reviews" },
    { name: review.title, url: `https://example.com/reviews/${review.slug}` },
  ]

  // Organization data
  const organization = {
    name: "Affiliate Platform",
    url: "https://example.com",
    description: "Product reviews and comparisons",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Schema */}
      <ReviewSchema
        review={review}
        ratingValue={review.rating || 0}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <OrganizationSchema {...organization} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/reviews" className="hover:text-blue-600">Reviews</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{review.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Link>

        {/* Review Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{review.title}</h1>
              {review.product && (
                <Link
                  href={`/products/${review.product.slug}`}
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  {review.product.name}
                </Link>
              )}
            </div>
            {review.rating && review.rating > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold">{review.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
            )}
          </div>

          {review.excerpt && (
            <p className="text-gray-600 mt-4">{review.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            {review.author && (
              <span>By {review.author.name || "Anonymous"}</span>
            )}
            {review.publishedAt && (
              <span>
                {new Date(review.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {review.views && review.views > 0 && (
              <span>{review.views} views</span>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReviewContent review={review} />
          </div>
          <div className="lg:col-span-1">
            <ReviewSidebar
              product={review.product}
              relatedProducts={relatedProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
