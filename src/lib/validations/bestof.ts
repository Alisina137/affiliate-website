// src/lib/validations/bestof.ts
import { z } from "zod"

const bestOfEntrySchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  bestFor: z.string().max(200, "Best for must be at most 200 characters").optional(),
  summary: z.string().max(1000, "Summary must be at most 1000 characters").optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  order: z.number().int().min(0).default(0),
})

export const createBestOfSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  slug: z.string()
    .min(5, "Slug must be at least 5 characters")
    .max(200, "Slug must be at most 200 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  authorId: z.string().cuid("Invalid author ID"),
  categoryId: z.string().cuid("Invalid category ID").optional(),
  content: z.string().max(10000, "Content must be at most 10000 characters").optional(),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional(),
  introduction: z.string().max(2000, "Introduction must be at most 2000 characters").optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(60, "SEO title must be at most 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description must be at most 160 characters").optional(),
  contentBlocks: z.any().optional(),
  entries: z.array(bestOfEntrySchema).min(3, "At least 3 products are required for a best-of list"),
})

export const updateBestOfSchema = createBestOfSchema.partial()

export type CreateBestOfInput = z.infer<typeof createBestOfSchema>
export type UpdateBestOfInput = z.infer<typeof updateBestOfSchema>
