// src/types/product.ts
import type { Product, Brand, Category, Niche, AffiliateLink, Review } from "@prisma/client"

// Product with relations
export type ProductWithRelations = Product & {
  brand?: Brand | null
  category?: Category | null
  niche?: Niche | null
  affiliateLinks?: AffiliateLink[]
  reviews?: Review[]
}

// Product with full details (for product page)
export type ProductDetails = ProductWithRelations & {
  affiliateLinks: AffiliateLink[]
  reviews: Review[]
}

// Product list item (for search results, listings)
export type ProductListItem = Pick<Product, 
  "id" | "name" | "slug" | "price" | "currency" | "rating" | "reviewCount" | "images" | "bestFor" | "availability"
> & {
  brand?: Pick<Brand, "id" | "name" | "slug"> | null
  category?: Pick<Category, "id" | "name" | "slug"> | null
}

// Product filter options
export interface ProductFilterOptions {
  categories?: { id: string; name: string }[]
  brands?: { id: string; name: string }[]
  priceRange?: { min: number; max: number }
  availabilities?: string[]
}

// Product sort options
export interface ProductSortOption {
  label: string
  value: string
  direction: "asc" | "desc"
}

export const productSortOptions: ProductSortOption[] = [
  { label: "Newest", value: "createdAt", direction: "desc" },
  { label: "Oldest", value: "createdAt", direction: "asc" },
  { label: "Price: Low to High", value: "price", direction: "asc" },
  { label: "Price: High to Low", value: "price", direction: "desc" },
  { label: "Highest Rated", value: "rating", direction: "desc" },
  { label: "Most Popular", value: "reviewCount", direction: "desc" },
]

// Product price formatting
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price)
}

// Product availability status
export const productAvailabilityStatus = {
  IN_STOCK: { label: "In Stock", color: "green" },
  OUT_OF_STOCK: { label: "Out of Stock", color: "red" },
  PRE_ORDER: { label: "Pre-Order", color: "yellow" },
  DISCONTINUED: { label: "Discontinued", color: "gray" },
} as const

export type ProductAvailability = keyof typeof productAvailabilityStatus
