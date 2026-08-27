// src/lib/validations/ai-prompt.ts
import { z } from "zod"
import { aiContentTypes, aiOperations } from "./ai-generation"

export const createAIPromptTemplateSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  contentType: z.enum(aiContentTypes),
  operation: z.enum(aiOperations),
  userPrompt: z.string()
    .min(10, "User prompt must be at least 10 characters")
    .max(5000, "User prompt must be at most 5000 characters"),
  description: z.string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  systemPrompt: z.string()
    .max(2000, "System prompt must be at most 2000 characters")
    .optional(),
  isDefault: z.boolean().default(false),
  metadata: z.any().optional(),
  createdBy: z.string().cuid("Invalid user ID"),
})

export const updateAIPromptTemplateSchema = createAIPromptTemplateSchema.partial()

export type CreateAIPromptTemplateInput = z.infer<typeof createAIPromptTemplateSchema>
export type UpdateAIPromptTemplateInput = z.infer<typeof updateAIPromptTemplateSchema>
