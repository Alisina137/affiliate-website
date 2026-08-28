// src/components/seo/OrganizationSchema.tsx
interface OrganizationSchemaProps {
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    ...(logo && { "logo": logo }),
    ...(description && { "description": description }),
    ...(sameAs.length > 0 && { "sameAs": sameAs }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
