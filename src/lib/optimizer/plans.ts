export const OPTIMIZER_PLANS = {
  FREE: { name: "Free", priceMonthly: 0, projects: 1, analyses: 3, optimizations: 10 },
  STARTER: { name: "Starter", priceMonthly: 19, projects: 5, analyses: 30, optimizations: 100 },
  PRO: { name: "Pro", priceMonthly: 49, projects: null, analyses: 150, optimizations: 500 },
  AGENCY: { name: "Agency", priceMonthly: 99, projects: null, analyses: 500, optimizations: 2000 },
} as const

export type OptimizerPlan = keyof typeof OPTIMIZER_PLANS
export type MeteredOptimizerAction = "ARTICLE_ANALYZED" | "AI_OPTIMIZATION_CREATED"

export function isOptimizerPlan(value: string | null | undefined): value is OptimizerPlan {
  return Boolean(value && value in OPTIMIZER_PLANS)
}
