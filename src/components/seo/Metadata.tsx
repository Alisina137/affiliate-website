// src/components/seo/Metadata.tsx
import type { Metadata } from "next"

export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: "website" | "article"
  }
  twitter?: {
    card?: "summary" | "summary_large_image"
    title?: string
    description?: string
    image?: string
  }
  robots?: {
    index?: boolean
    follow?: boolean
    noarchive?: boolean
  }
}

export function generateMetadata(seo: SEOMetadata): Metadata {
  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    robots: {
      index: seo.robots?.index ?? true,
      follow: seo.robots?.follow ?? true,
      noarchive: seo.robots?.noarchive ?? false,
    },
  }

  if (seo.canonicalUrl) {
    metadata.alternates = {
      canonical: seo.canonicalUrl,
    }
  }

  if (seo.openGraph) {
    metadata.openGraph = {
      title: seo.openGraph.title || seo.title,
      description: seo.openGraph.description || seo.description,
      images: seo.openGraph.image ? [{ url: seo.openGraph.image }] : undefined,
      url: seo.openGraph.url || seo.canonicalUrl,
      type: seo.openGraph.type || "website",
    }
  }

  if (seo.twitter) {
    metadata.twitter = {
      card: seo.twitter.card || "summary_large_image",
      title: seo.twitter.title || seo.title,
      description: seo.twitter.description || seo.description,
      images: seo.twitter.image ? [seo.twitter.image] : undefined,
    }
  }

  return metadata
}
