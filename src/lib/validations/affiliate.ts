// src/lib/validations/affiliate.ts
import { z } from "zod"

export const createAffiliateLinkSchema = z.object({
  url: z.string()
    .url("Must be a valid URL"),
  productId: z.string().cuid("Invalid product ID"),
  merchant: z.string()
    .min(2, "Merchant name must be at least 2 characters")
    .max(100, "Merchant name must be at most 100 characters"),
  merchantId: z.string().cuid("Invalid merchant ID").optional(),
  label: z.string()
    .min(2, "Label must be at least 2 characters")
    .max(50, "Label must be at most 50 characters")
    .default("Check Price"),
  trackingUrl: z.string().url("Must be a valid URL").optional(),
  country: z.string()
    .length(2, "Country must be a 2-letter code (e.g., US, UK)")
    .default("US"),
  priority: z.number()
    .int()
    .min(0, "Priority must be 0 or greater")
    .default(0),
})

export const updateAffiliateLinkSchema = createAffiliateLinkSchema.partial()

export type CreateAffiliateLinkInput = z.infer<typeof createAffiliateLinkSchema>
export type UpdateAffiliateLinkInput = z.infer<typeof updateAffiliateLinkSchema>
