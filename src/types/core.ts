// src/types/core.ts
import type { Niche, Category, Brand } from "@prisma/client"

// Extended types with relationships
export type NicheWithRelations = Niche & {
  categories?: Category[]
  brands?: Brand[]
}

export type CategoryWithRelations = Category & {
  parent?: Category | null
  children?: Category[]
  niche?: Niche
  brands?: Brand[]
}

export type BrandWithRelations = Brand & {
  niche?: Niche | null
  categories?: Category[]
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// List response with pagination
export interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Common filter params
export interface FilterParams {
  search?: string
  isActive?: boolean
  nicheId?: string
  categoryId?: string
  brandId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}
