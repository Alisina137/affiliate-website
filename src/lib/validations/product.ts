// src/lib/validations/product.ts
import { z } from "zod"

// Base product schema for creation
export const createProductSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string()
    .max(5000, "Description must be at most 5000 characters")
    .optional(),
  shortDescription: z.string()
    .max(500, "Short description must be at most 500 characters")
    .optional(),
  price: z.number()
    .positive("Price must be greater than 0")
    .optional(),
  currency: z.string()
    .length(3, "Currency must be a 3-letter code (e.g., USD, EUR)")
    .default("USD")
    .optional(),
  brandId: z.string().cuid("Invalid brand ID").optional(),
  categoryId: z.string().cuid("Invalid category ID").optional(),
  nicheId: z.string().cuid("Invalid niche ID").optional(),
  specifications: z.record(z.any()).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url("Must be a valid URL")).optional(),
  bestFor: z.string().max(200, "Best for must be at most 200 characters").optional(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER", "DISCONTINUED"])
    .default("IN_STOCK"),
})

// Schema for updating a product (all fields optional)
export const updateProductSchema = createProductSchema.partial()

// Schema for product search/filtering
export const productFilterSchema = z.object({
  categoryId: z.string().cuid("Invalid category ID").optional(),
  brandId: z.string().cuid("Invalid brand ID").optional(),
  nicheId: z.string().cuid("Invalid niche ID").optional(),
  search: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
  featured: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  limit: z.number().int().min(1).max(100).default(20).optional(),
  offset: z.number().int().min(0).default(0).optional(),
  sortBy: z.enum(["name", "price", "rating", "createdAt", "updatedAt"])
    .default("createdAt").optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
})

// Schema for affiliate link
export const createAffiliateLinkSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  productId: z.string().cuid("Invalid product ID"),
  merchant: z.string().min(1, "Merchant name is required"),
  label: z.string().default("Check Price"),
  trackingUrl: z.string().url("Must be a valid URL").optional(),
  country: z.string().length(2, "Country must be a 2-letter code (e.g., US, UK)")
    .default("US"),
  priority: z.number().int().min(0).default(0).optional(),
})

export const updateAffiliateLinkSchema = createAffiliateLinkSchema.partial()

// Export types
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductFilterInput = z.infer<typeof productFilterSchema>
export type CreateAffiliateLinkInput = z.infer<typeof createAffiliateLinkSchema>
export type UpdateAffiliateLinkInput = z.infer<typeof updateAffiliateLinkSchema>
