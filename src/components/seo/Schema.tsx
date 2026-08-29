// src/components/seo/Schema.tsx
"use client"

interface SchemaProps {
  data: Record<string, any>
}

export function Schema({ data }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
