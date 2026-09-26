import { describe, expect, it } from "vitest"
import { isOptimizerPlan, OPTIMIZER_PLANS } from "./plans"

describe("optimizer plans", () => {
  it("keeps the approved independent plan limits", () => {
    expect(OPTIMIZER_PLANS.FREE).toMatchObject({ projects: 1, analyses: 3, optimizations: 10 })
    expect(OPTIMIZER_PLANS.STARTER).toMatchObject({ priceMonthly: 19, projects: 5, analyses: 30, optimizations: 100 })
    expect(OPTIMIZER_PLANS.PRO).toMatchObject({ priceMonthly: 49, projects: null, analyses: 150, optimizations: 500 })
    expect(OPTIMIZER_PLANS.AGENCY).toMatchObject({ priceMonthly: 99, projects: null, analyses: 500, optimizations: 2000 })
  })
  it("rejects unknown plan names", () => {
    expect(isOptimizerPlan("PRO")).toBe(true)
    expect(isOptimizerPlan("BUNDLE")).toBe(false)
  })
})
