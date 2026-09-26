import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) return true
    try {
      const url = new URL(value)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }, "Source URL must be a valid HTTP or HTTPS URL.")

const optimizerArticleFields = {
  projectId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(200),
  sourceUrl: optionalUrl,
  content: z.string().trim().max(150000).optional().or(z.literal("")),
  targetQuery: z.string().trim().min(2).max(200),
  secondaryKeywords: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  country: z.string().trim().min(2).max(80).default("US"),
  language: z.string().trim().min(2).max(80).default("en"),
}

const requireArticleSource = <T extends { sourceUrl?: string; content?: string }>(data: T) =>
  Boolean(data.sourceUrl || data.content)

export const optimizerArticleInputSchema = z
  .object(optimizerArticleFields)
  .refine(requireArticleSource, {
    message: "Provide either an article URL or pasted article content.",
    path: ["content"],
  })

export const optimizerArticleUpdateSchema = z
  .object({
    title: optimizerArticleFields.title,
    sourceUrl: optimizerArticleFields.sourceUrl,
    content: optimizerArticleFields.content,
    targetQuery: optimizerArticleFields.targetQuery,
    secondaryKeywords: optimizerArticleFields.secondaryKeywords,
    country: optimizerArticleFields.country,
    language: optimizerArticleFields.language,
  })
  .refine(requireArticleSource, {
    message: "Provide either an article URL or pasted article content.",
    path: ["content"],
  })

export type OptimizerArticleInput = z.infer<typeof optimizerArticleInputSchema>
