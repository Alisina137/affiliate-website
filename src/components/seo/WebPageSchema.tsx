// src/components/seo/WebPageSchema.tsx
import { Schema } from "./Schema"

interface WebPageSchemaProps {
  name: string
  description?: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  about?: string
  author?: string
}

export function WebPageSchema({
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  about,
  author,
}: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "about": about,
    "author": author ? { "@type": "Person", "name": author } : undefined,
  }

  return <Schema data={schema} />
}
