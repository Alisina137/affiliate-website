import { describe, expect, it } from "vitest"
import { analyzeCompetitors } from "./competitor-intelligence"

describe("competitor intelligence", () => {
  it("requires at least one supplied competitor URL", async () => {
    await expect(analyzeCompetitors("My article", [])).rejects.toThrow("Add at least one competitor URL")
  })

  it("inherits safe-fetch protection for private competitor URLs", async () => {
    await expect(analyzeCompetitors("My article", ["http://127.0.0.1/private"])).rejects.toThrow("Private or internal IP")
  })
})
