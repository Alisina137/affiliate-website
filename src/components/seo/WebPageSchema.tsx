// src/components/seo/WebPageSchema.tsx
interface WebPageSchemaProps {
  name: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
  image?: string
}

export function WebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    ...(description && { "description": description }),
    "url": url,
    ...(datePublished && { "datePublished": datePublished }),
    ...(dateModified && { "dateModified": dateModified }),
    ...(image && { "image": image }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
