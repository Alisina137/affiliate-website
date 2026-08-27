// src/lib/validations/guide.ts
import { z } from "zod"

const guideProductSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  context: z.string().max(500, "Context must be at most 500 characters").optional(),
  order: z.number().int().min(0).default(0),
})

export const createGuideSchema = z.object({
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
  tableOfContents: z.any().optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(60, "SEO title must be at most 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description must be at most 160 characters").optional(),
  contentBlocks: z.any().optional(),
  guideProducts: z.array(guideProductSchema).optional(),
})

export const updateGuideSchema = createGuideSchema.partial()

export type CreateGuideInput = z.infer<typeof createGuideSchema>
export type UpdateGuideInput = z.infer<typeof updateGuideSchema>
