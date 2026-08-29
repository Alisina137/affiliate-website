// src/types/article.ts
import type {
  Article,
  Review,
  Comparison,
  BestOf,
  Guide,
  Statistic,
  User,
  Category,
  Product,
  Brand,
} from "@prisma/client"

// ============================================
// ADD THESE MISSING TYPES
// ============================================

// Base types for relation models (these come from your Prisma schema)
export type ComparisonProduct = {
  id: string
  comparisonId: string
  productId: string
  score?: number | null
  position?: number
  notes?: string | null
  product: Product & {
    brand?: Brand | null
  }
}

export type BestOfEntry = {
  id: string
  bestOfId: string
  productId: string
  position: number
  award?: string | null
  score?: number | null
  pros?: string[] | null
  cons?: string[] | null
  product: Product & {
    brand?: Brand | null
  }
}

export type GuideProduct = {
  id: string
  guideId: string
  productId: string
  position: number
  isRecommended?: boolean
  pros?: string[] | null
  cons?: string[] | null
  product: Product & {
    brand?: Brand | null
  }
}

// ============================================
// ARTICLE TYPES
// ============================================

export type ArticleWithRelations = Article & {
  author?: Pick<User, "id" | "name" | "email" | "image">
  category?: Category | null
}

// ============================================
// REVIEW TYPES
// ============================================

export type ReviewWithRelations = Review & {
  product: Product & {
    brand?: Brand | null
    affiliateLinks?: unknown[]  // Changed from any[] to unknown[]
  }
  author?: Pick<User, "id" | "name" | "email" | "image">
}

export interface ReviewListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  rating: number | null
  pros: string[]
  cons: string[]
  bestFor: string | null
  featured: boolean
  publishedAt: Date | null
  product: {
    id: string
    name: string
    slug: string
    price: number | null
    images: string[]
    brand?: {
      id: string
      name: string
      slug: string
    } | null
  }
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

// ============================================
// COMPARISON TYPES
// ============================================

export type ComparisonWithRelations = Comparison & {
  products: (ComparisonProduct & {
    product: Product & {
      brand?: Brand | null
    }
  })[]
  author?: Pick<User, "id" | "name" | "email" | "image">
}

// ============================================
// BEST-OF TYPES
// ============================================

export type BestOfWithRelations = BestOf & {
  category?: Category | null
  entries: (BestOfEntry & {
    product: Product & {
      brand?: Brand | null
    }
  })[]
  author?: Pick<User, "id" | "name" | "email" | "image">
}

// ============================================
// GUIDE TYPES
// ============================================

export type GuideWithRelations = Guide & {
  category?: Category | null
  guideProducts: (GuideProduct & {
    product: Product & {
      brand?: Brand | null
    }
  })[]
  author?: Pick<User, "id" | "name" | "email" | "image">
}

// ============================================
// STATISTIC TYPES
// ============================================

export type StatisticWithRelations = Statistic & {
  niche?: { id: string; name: string; slug: string } | null
  author?: Pick<User, "id" | "name" | "email" | "image">
}

// ============================================
// CONTENT STATUS
// ============================================

export type ContentStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"

export const contentStatuses: { value: ContentStatus; label: string; color: string }[] = [
  { value: "DRAFT", label: "Draft", color: "gray" },
  { value: "REVIEW", label: "In Review", color: "yellow" },
  { value: "PUBLISHED", label: "Published", color: "green" },
  { value: "ARCHIVED", label: "Archived", color: "red" },
]

// ============================================
// CONTENT BLOCKS
// ============================================

export type ContentBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "product"
  | "comparison"
  | "table"
  | "prosCons"
  | "quote"
  | "affiliateCTA"
  | "statistics"

export interface ContentBlock {
  id: string
  type: ContentBlockType
  data: Record<string, unknown>  // Changed from any to unknown
}
