import { describe, expect, it } from "vitest"
import { getOptimizerAIProvider, optimizationResultSchema } from "./provider"

describe("optimizer AI provider contract", () => {
  it("returns validated Original-to-Suggested output in development", async () => {
    const provider = getOptimizerAIProvider()
    const result = await provider.optimize({
      operation: "CTA",
      originalContent: "This section compares two options.",
      targetQuery: "best walking pads",
      articleTitle: "Walking pads",
    })
    expect(optimizationResultSchema.parse(result).suggestedContent).toContain("Next step")
    expect(result.warnings.length).toBeGreaterThan(0)
  })
})
