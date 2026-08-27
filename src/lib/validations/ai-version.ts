// src/lib/validations/ai-version.ts
import { z } from "zod"
import { aiContentTypes, aiChangeTypes } from "./ai-generation"

export const createAIContentVersionSchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  contentType: z.enum(aiContentTypes),
  data: z.any(),
  changes: z.any().optional(),
  createdBy: z.string().cuid("Invalid user ID"),
  generationId: z.string().optional(),
  changeType: z.enum(aiChangeTypes),
})

export const updateAIContentVersionSchema = createAIContentVersionSchema.partial()

export type CreateAIContentVersionInput = z.infer<typeof createAIContentVersionSchema>
export type UpdateAIContentVersionInput = z.infer<typeof updateAIContentVersionSchema>
