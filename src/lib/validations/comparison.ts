// src/lib/validations/comparison.ts
import { z } from "zod"

const comparisonProductSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  bestFor: z.string().max(200, "Best for must be at most 200 characters").optional(),
  order: z.number().int().min(0).default(0),
})

export const createComparisonSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  slug: z.string()
    .min(5, "Slug must be at least 5 characters")
    .max(200, "Slug must be at most 200 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  authorId: z.string().cuid("Invalid author ID"),
  content: z.string().max(10000, "Content must be at most 10000 characters").optional(),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional(),
  winner: z.string().max(200, "Winner must be at most 200 characters").optional(),
  winnerExplanation: z.string().max(1000, "Winner explanation must be at most 1000 characters").optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(60, "SEO title must be at most 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description must be at most 160 characters").optional(),
  contentBlocks: z.any().optional(),
  products: z.array(comparisonProductSchema).min(2, "At least 2 products are required for a comparison"),
})

export const updateComparisonSchema = createComparisonSchema.partial()

export type CreateComparisonInput = z.infer<typeof createComparisonSchema>
export type UpdateComparisonInput = z.infer<typeof updateComparisonSchema>
