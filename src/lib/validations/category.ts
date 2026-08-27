// src/lib/validations/category.ts
import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  nicheId: z.string().cuid("Invalid niche ID"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  image: z.string().url("Must be a valid URL").optional(),
  parentId: z.string().cuid("Invalid parent ID").optional(),
  order: z.number().int().min(0).default(0),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
