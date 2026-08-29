// src/components/seo/ComparisonSchema.tsx
import { Schema } from "./Schema"

interface ComparisonProduct {
  name: string
  description?: string
  image?: string
  rating?: number
  price?: number
}

interface ComparisonSchemaProps {
  name: string
  description?: string
  winner?: string
  products: ComparisonProduct[]
}

export function ComparisonSchema({
  name,
  description,
  winner,
  products,
}: ComparisonSchemaProps) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "aggregateRating": product.rating ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
        } : undefined,
        "offers": product.price ? {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
        } : undefined,
      },
    })),
  }

  // Only add winner if it exists - using bracket notation to avoid TypeScript error
  if (winner) {
    schema.winner = winner
  }

  return <Schema data={schema} />
}
