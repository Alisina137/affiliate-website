// src/lib/validations/niche.ts
import { z } from "zod"

export const createNicheSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  image: z.string().url("Must be a valid URL").optional(),
})

export const updateNicheSchema = createNicheSchema.partial()

export type CreateNicheInput = z.infer<typeof createNicheSchema>
export type UpdateNicheInput = z.infer<typeof updateNicheSchema>
