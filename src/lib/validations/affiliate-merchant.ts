// src/lib/validations/affiliate-merchant.ts
import { z } from "zod"

export const createAffiliateMerchantSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  programId: z.string().cuid("Invalid program ID"),
  description: z.string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  logo: z.string().url("Must be a valid URL").optional(),
  website: z.string().url("Must be a valid URL").optional(),
})

export const updateAffiliateMerchantSchema = createAffiliateMerchantSchema.partial()

export type CreateAffiliateMerchantInput = z.infer<typeof createAffiliateMerchantSchema>
export type UpdateAffiliateMerchantInput = z.infer<typeof updateAffiliateMerchantSchema>
