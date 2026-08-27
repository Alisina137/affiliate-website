// src/lib/validations/affiliate-click.ts
import { z } from "zod"

// Custom IP validation
const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

export const createAffiliateClickSchema = z.object({
  affiliateLinkId: z.string().cuid("Invalid affiliate link ID"),
  productId: z.string().cuid("Invalid product ID").optional(),
  userId: z.string().cuid("Invalid user ID").optional(),
  ipAddress: z.string()
    .regex(ipRegex, "Must be a valid IP address")
    .optional(),
  userAgent: z.string().optional(),
  referer: z.string().url("Must be a valid URL").optional(),
  country: z.string()
    .length(2, "Country must be a 2-letter code")
    .optional(),
  device: z.enum(["desktop", "mobile", "tablet"]).optional(),
})

export const recordConversionSchema = z.object({
  clickId: z.string().cuid("Invalid click ID"),
  value: z.number().positive("Conversion value must be positive").optional(),
})

export type CreateAffiliateClickInput = z.infer<typeof createAffiliateClickSchema>
export type RecordConversionInput = z.infer<typeof recordConversionSchema>
