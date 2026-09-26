import { describe, expect, it } from "vitest"
import { analyzeCompetitors } from "./competitor-intelligence"

describe("competitor intelligence", () => {
  it("requires at least one supplied competitor URL", async () => {
    await expect(analyzeCompetitors("My article", [])).rejects.toThrow("Add at least one competitor URL")
  })
})
