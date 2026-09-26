import { z } from "zod"

export const optimizationOperationSchema = z.enum(["REWRITE", "EXPAND", "SIMPLIFY", "SEO", "CTA", "PERSUASION"])
export type OptimizationOperation = z.infer<typeof optimizationOperationSchema>

export const optimizationResultSchema = z.object({
  suggestedContent: z.string().min(1).max(150000),
  rationale: z.string().min(1).max(3000),
  warnings: z.array(z.string().max(500)).max(10).default([]),
})

export type OptimizationRequest = {
  operation: OptimizationOperation
  originalContent: string
  targetQuery: string
  articleTitle: string
  instructions?: string
}

export type OptimizationResult = z.infer<typeof optimizationResultSchema>

export interface OptimizerAIProvider {
  readonly name: string
  readonly model: string
  optimize(request: OptimizationRequest): Promise<OptimizationResult>
}

class LocalDevelopmentProvider implements OptimizerAIProvider {
  readonly name = "local"
  readonly model = "deterministic-dev-v1"

  async optimize(request: OptimizationRequest): Promise<OptimizationResult> {
    const original = request.originalContent.trim()
    let suggestedContent = original
    const query = request.targetQuery.trim()

    switch (request.operation) {
      case "SIMPLIFY":
        suggestedContent = original.replace(/;\s+/g, ". ").replace(/\s+/g, " ").trim()
        break
      case "EXPAND":
        suggestedContent = `${original}\n\nBuyer considerations\nWhen evaluating options related to ${query}, compare the features that materially affect the reader's use case, limitations, total cost, and suitability. Verify product-specific claims against reliable current sources before publishing.`
        break
      case "SEO":
        suggestedContent = original.toLowerCase().includes(query.toLowerCase())
          ? original
          : `${query}: ${original}`
        break
      case "CTA":
        suggestedContent = `${original}\n\nNext step: compare the options that fit your needs and verify the current price, terms, and availability before deciding.`
        break
      case "PERSUASION":
        suggestedContent = `${original}\n\nFocus the recommendation on the reader's decision criteria, explain trade-offs clearly, and support factual claims with current evidence.`
        break
      case "REWRITE":
        suggestedContent = original.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean).join("\n\n")
        break
    }

    return optimizationResultSchema.parse({
      suggestedContent,
      rationale: `Development-mode ${request.operation.toLowerCase()} suggestion. Review and edit it before accepting; no factual claims were independently verified.`,
      warnings: ["Development provider: this suggestion is deterministic and does not call a remote AI model."],
    })
  }
}

export function getOptimizerAIProvider(): OptimizerAIProvider {
  return new LocalDevelopmentProvider()
}
