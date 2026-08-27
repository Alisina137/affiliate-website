// src/lib/validations/ai-usage.ts
import { z } from "zod"
import { aiContentTypes, aiOperations } from "./ai-generation"

export const createAIUsageSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  contentType: z.enum(aiContentTypes),
  operation: z.enum(aiOperations),
  model: z.string().min(1, "Model name is required"),
  inputTokens: z.number().int().min(0, "Input tokens must be 0 or greater"),
  outputTokens: z.number().int().min(0, "Output tokens must be 0 or greater"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  duration: z.number().int().min(0, "Duration must be 0 or greater"),
  generationId: z.string().optional(),
})

export const updateAIUsageSchema = createAIUsageSchema.partial()

export type CreateAIUsageInput = z.infer<typeof createAIUsageSchema>
export type UpdateAIUsageInput = z.infer<typeof updateAIUsageSchema>
