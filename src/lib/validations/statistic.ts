// src/lib/validations/statistic.ts
import { z } from "zod"

export const createStatisticSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  slug: z.string()
    .min(5, "Slug must be at least 5 characters")
    .max(200, "Slug must be at most 200 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  authorId: z.string().cuid("Invalid author ID"),
  nicheId: z.string().cuid("Invalid niche ID").optional(),
  content: z.string().max(10000, "Content must be at most 10000 characters").optional(),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional(),
  data: z.any().default({}),
  sources: z.array(z.string().url("Source must be a valid URL")).default([]),
  methodology: z.string().max(2000, "Methodology must be at most 2000 characters").optional(),
  embedCode: z.string().optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(60, "SEO title must be at most 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description must be at most 160 characters").optional(),
  contentBlocks: z.any().optional(),
})

export const updateStatisticSchema = createStatisticSchema.partial()

export type CreateStatisticInput = z.infer<typeof createStatisticSchema>
export type UpdateStatisticInput = z.infer<typeof updateStatisticSchema>
