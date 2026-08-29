// src/components/seo/ArticleSchema.tsx
import { Schema } from "./Schema"

interface ArticleSchemaProps {
  headline: string
  description?: string
  image?: string
  authorName: string
  datePublished: string
  dateModified?: string
  publisherName: string
  publisherLogo?: string
  keywords?: string[]
  section?: string
}

export function ArticleSchema({
  headline,
  description,
  image,
  authorName,
  datePublished,
  dateModified,
  publisherName,
  publisherLogo,
  keywords,
  section,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": publisherLogo ? { "@type": "ImageObject", "url": publisherLogo } : undefined,
    },
    "keywords": keywords?.join(", "),
    "articleSection": section,
  }

  return <Schema data={schema} />
}
