// src/lib/validations/brand.ts
import { z } from "zod"

export const createBrandSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  logo: z.string().url("Must be a valid URL").optional(),
  website: z.string().url("Must be a valid URL").optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  headquarters: z.string().max(100).optional(),
  nicheId: z.string().cuid("Invalid niche ID").optional(),
})

export const updateBrandSchema = createBrandSchema.partial()

export type CreateBrandInput = z.infer<typeof createBrandSchema>
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>
