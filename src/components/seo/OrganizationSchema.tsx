// src/components/seo/OrganizationSchema.tsx
import { Schema } from "./Schema"

interface OrganizationSchemaProps {
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
  email?: string
  phone?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  sameAs = [],
  email,
  phone,
  address,
}: OrganizationSchemaProps) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
  }

  if (logo) schema.logo = logo
  if (description) schema.description = description
  if (sameAs.length > 0) schema.sameAs = sameAs
  if (email) schema.email = email
  if (phone) schema.telephone = phone
  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      ...address,
    }
  }

  return <Schema data={schema} />
}
