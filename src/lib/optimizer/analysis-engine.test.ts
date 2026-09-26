import { describe, expect, it } from "vitest"
import { analyzeArticle } from "./analysis-engine"

describe("optimizer analysis engine", () => {
  it("returns all six bounded scores and an overall score", () => {
    const result = analyzeArticle({
      title: "Best Walking Pads for Small Apartments",
      targetQuery: "best walking pads",
      sourceUrl: "https://example.com/best-walking-pads",
      content: ("Best walking pads help apartment users compare compact options. Check price after reviewing pros and cons. " +
        "This review explains what each walking pad is best for and how to compare features. ").repeat(80),
    })
    expect(result.overallScore).toBeGreaterThanOrEqual(0)
    expect(result.overallScore).toBeLessThanOrEqual(100)
    expect(Object.keys(result.scores)).toEqual(["seo", "content", "intent", "affiliate", "conversion", "technical"])
  })

  it("produces explainable issues for weak content", () => {
    const result = analyzeArticle({ title: "My page", targetQuery: "best laptop", content: "A short introduction." })
    expect(result.issues.some((issue) => issue.category === "SEO")).toBe(true)
    expect(result.issues.some((issue) => issue.category === "CONTENT")).toBe(true)
    expect(result.issues.some((issue) => issue.category === "CONVERSION")).toBe(true)
    expect(result.issues.every((issue) => Boolean(issue.description && issue.suggestion))).toBe(true)
  })
})
