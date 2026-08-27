// src/lib/validations/affiliate-program.ts
import { z } from "zod"

export const createAffiliateProgramSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  logo: z.string().url("Must be a valid URL").optional(),
  website: z.string().url("Must be a valid URL").optional(),
  commission: z.string()
    .max(100, "Commission must be at most 100 characters")
    .optional(),
  cookieDuration: z.number()
    .int()
    .min(0, "Cookie duration must be 0 or greater")
    .optional(),
})

export const updateAffiliateProgramSchema = createAffiliateProgramSchema.partial()

export type CreateAffiliateProgramInput = z.infer<typeof createAffiliateProgramSchema>
export type UpdateAffiliateProgramInput = z.infer<typeof updateAffiliateProgramSchema>
