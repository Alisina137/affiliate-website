// src/lib/validations/article.ts
import { z } from "zod"

export const createArticleSchema = z.object({
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
  featured: z.boolean().default(false),
  seoTitle: z.string().max(60, "SEO title must be at most 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description must be at most 160 characters").optional(),
  contentBlocks: z.any().optional(),
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
