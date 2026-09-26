import { afterEach, describe, expect, it, vi } from "vitest"
import { getOptimizerAIProvider, OpenAIOptimizerProvider, optimizationResultSchema } from "./provider"

const originalProvider = process.env.OPTIMIZER_AI_PROVIDER
const originalKey = process.env.OPENAI_API_KEY

afterEach(() => {
  vi.unstubAllGlobals()
  if (originalProvider === undefined) delete process.env.OPTIMIZER_AI_PROVIDER
  else process.env.OPTIMIZER_AI_PROVIDER = originalProvider
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY
  else process.env.OPENAI_API_KEY = originalKey
})

describe("optimizer AI provider contract", () => {
  it("defaults to validated deterministic local output", async () => {
    delete process.env.OPTIMIZER_AI_PROVIDER
    const provider = getOptimizerAIProvider()
    const result = await provider.optimize({
      operation: "CTA",
      originalContent: "This section compares two options.",
      targetQuery: "best walking pads",
      articleTitle: "Walking pads",
    })
    expect(provider.name).toBe("local")
    expect(optimizationResultSchema.parse(result).suggestedContent).toContain("Next step")
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it("selects OpenAI only when explicitly configured", () => {
    process.env.OPTIMIZER_AI_PROVIDER = "openai"
    expect(getOptimizerAIProvider()).toBeInstanceOf(OpenAIOptimizerProvider)
  })

  it("validates structured OpenAI output and captures token usage", async () => {
    process.env.OPENAI_API_KEY = "test-key"
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          suggestedContent: "A clearer comparison.",
          rationale: "Improves clarity without adding product facts.",
          warnings: [],
        }),
        usage: { input_tokens: 120, output_tokens: 45 },
      }),
    }))
    const result = await new OpenAIOptimizerProvider("test-model").optimize({
      operation: "REWRITE",
      originalContent: "Compare these options.",
      targetQuery: "best option",
      articleTitle: "Options",
    })
    expect(result.suggestedContent).toBe("A clearer comparison.")
    expect(result.usage).toEqual({ inputTokens: 120, outputTokens: 45 })
  })
})
