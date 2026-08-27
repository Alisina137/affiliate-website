// src/lib/validations/ai-generation.ts
import { z } from "zod"

export const aiContentTypes = [
  "REVIEW",
  "COMPARISON",
  "BEST_OF",
  "GUIDE",
  "STATISTICS",
  "PRODUCT",
  "CATEGORY",
  "BRAND",
  "FAQ",
  "SEO",
  "OUTLINE",
] as const

export const aiOperations = [
  "GENERATE",
  "REGENERATE",
  "IMPROVE",
  "REWRITE",
  "EXPAND",
  "SHORTEN",
  "SIMPLIFY",
  "ANALYZE",
] as const

export const aiStatuses = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "PARTIAL",
] as const

export const aiChangeTypes = [
  "MANUAL",
  "AI_GENERATED",
  "AI_IMPROVED",
  "AI_REWRITTEN",
  "ROLLBACK",
] as const

export const createAIGenerationSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  contentType: z.enum(aiContentTypes),
  contentId: z.string().optional(),
  operation: z.enum(aiOperations),
  model: z.string().min(1, "Model name is required"),
  promptVersion: z.string().optional(),
  input: z.any(),
  output: z.any().optional(),
  status: z.enum(aiStatuses).default("PENDING"),
  error: z.string().optional(),
  inputTokens: z.number().int().min(0).optional(),
  outputTokens: z.number().int().min(0).optional(),
  estimatedCost: z.number().min(0).optional(),
  duration: z.number().int().min(0).optional(),
})

export const updateAIGenerationSchema = createAIGenerationSchema.partial()

export type CreateAIGenerationInput = z.infer<typeof createAIGenerationSchema>
export type UpdateAIGenerationInput = z.infer<typeof updateAIGenerationSchema>
export type AIContentType = typeof aiContentTypes[number]
export type AIOperation = typeof aiOperations[number]
export type AIStatus = typeof aiStatuses[number]
export type AIChangeType = typeof aiChangeTypes[number]
