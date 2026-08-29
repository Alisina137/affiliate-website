// src/components/seo/ProductSchema.tsx
import { Schema } from "./Schema"

interface ProductSchemaProps {
  name: string
  description?: string
  image?: string
  brand?: string
  sku?: string
  mpn?: string
  price?: number
  priceCurrency?: string
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued"
  ratingValue?: number
  ratingCount?: number
  reviewCount?: number
  offers?: {
    price: number
    priceCurrency: string
    availability: string
    url?: string
    seller?: string
  }[]
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export function ProductSchema({
  name,
  description,
  image,
  brand,
  sku,
  mpn,
  price,
  priceCurrency = "USD",
  availability = "InStock",
  ratingValue,
  ratingCount,
  reviewCount,
  offers,
  aggregateRating,
}: ProductSchemaProps) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
  }

  if (description) schema.description = description
  if (image) schema.image = image
  if (brand) schema.brand = { "@type": "Brand", name: brand }
  if (sku) schema.sku = sku
  if (mpn) schema.mpn = mpn

  // Offers
  if (offers && offers.length > 0) {
    schema.offers = offers.map((offer) => ({
      "@type": "Offer",
      "price": offer.price,
      "priceCurrency": offer.priceCurrency || "USD",
      "availability": `https://schema.org/${offer.availability || "InStock"}`,
      "url": offer.url,
      "seller": offer.seller ? { "@type": "Organization", name: offer.seller } : undefined,
    }))
  } else if (price) {
    schema.offers = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": `https://schema.org/${availability}`,
    }
  }

  // Aggregate Rating
  if (aggregateRating || (ratingValue && (ratingCount || reviewCount))) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating?.ratingValue || ratingValue,
      "reviewCount": aggregateRating?.reviewCount || reviewCount || ratingCount || 1,
    }
  }

  return <Schema data={schema} />
}
