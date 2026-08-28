// src/components/reviews/ReviewSchema.tsx
interface ReviewWithRelations {
  id: string
  title: string
  content?: string | null
  excerpt?: string | null
  rating?: number | null
  pros: string[]
  cons: string[]
  verdict?: string | null
  bestFor?: string | null
  publishedAt?: Date | null
  product: {
    id: string
    name: string
    slug: string
    price?: number | null
    currency: string
    images: string[]
    brand?: {
      id: string
      name: string
      slug: string
    } | null
  }
  author: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  } | null
}

interface ReviewSchemaProps {
  review: ReviewWithRelations
  ratingValue: number
  bestRating?: number
  worstRating?: number
}

export function ReviewSchema({
  review,
  ratingValue,
  bestRating = 5,
  worstRating = 0,
}: ReviewSchemaProps) {
  const authorName = review.author?.name || "Anonymous"
  const productName = review.product?.name || "Product"
  const brandName = review.product?.brand?.name || undefined

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Review",
    "name": review.title,
    "reviewBody": review.content || review.excerpt || undefined,
    "datePublished": review.publishedAt?.toISOString() || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": ratingValue,
      "bestRating": bestRating,
      "worstRating": worstRating,
    },
    "itemReviewed": {
      "@type": "Product",
      "name": productName,
      ...(brandName && { "brand": { "@type": "Brand", "name": brandName } }),
      "description": review.excerpt || undefined,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
