// src/components/seo/ReviewSchema.tsx
import { Schema } from "./Schema"

interface ReviewSchemaProps {
  name: string
  reviewBody?: string
  ratingValue: number
  bestRating?: number
  worstRating?: number
  authorName: string
  datePublished?: string
  itemReviewed: {
    name: string
    description?: string
    image?: string
    brand?: string
    sku?: string
  }
}

export function ReviewSchema({
  name,
  reviewBody,
  ratingValue,
  bestRating = 5,
  worstRating = 0,
  authorName,
  datePublished,
  itemReviewed,
}: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "name": name,
    "reviewBody": reviewBody,
    "datePublished": datePublished || new Date().toISOString(),
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
      "name": itemReviewed.name,
      "description": itemReviewed.description,
      "image": itemReviewed.image,
      "brand": itemReviewed.brand ? { "@type": "Brand", name: itemReviewed.brand } : undefined,
      "sku": itemReviewed.sku,
    },
  }

  return <Schema data={schema} />
}
