import { db } from "@/lib/db"
import { isOptimizerPlan, OPTIMIZER_PLANS, type MeteredOptimizerAction, type OptimizerPlan } from "./plans"

export type OptimizerEntitlement = {
  plan: OptimizerPlan
  status: string
  periodStart: Date
  periodEnd: Date
}

function monthWindow(now = new Date()) {
  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
  }
}

export async function getOptimizerEntitlement(userId: string, now = new Date()): Promise<OptimizerEntitlement> {
  const subscription = await db.optimizerSubscription.findUnique({ where: { userId } })
  const active = subscription && ["ACTIVE", "TRIALING"].includes(subscription.status)
  const plan = active && isOptimizerPlan(subscription.plan) ? subscription.plan : "FREE"
  const fallback = monthWindow(now)
  return {
    plan,
    status: active ? subscription.status : "ACTIVE",
    periodStart: active && subscription.currentPeriodStart ? subscription.currentPeriodStart : fallback.start,
    periodEnd: active && subscription.currentPeriodEnd ? subscription.currentPeriodEnd : fallback.end,
  }
}

export async function getOptimizerUsageSummary(userId: string, now = new Date()) {
  const entitlement = await getOptimizerEntitlement(userId, now)
  const [projects, analyses, optimizations] = await Promise.all([
    db.optimizerProject.count({ where: { userId } }),
    db.optimizerUsage.aggregate({
      where: { userId, action: "ARTICLE_ANALYZED", createdAt: { gte: entitlement.periodStart, lt: entitlement.periodEnd } },
      _sum: { units: true },
    }),
    db.optimizerUsage.aggregate({
      where: { userId, action: "AI_OPTIMIZATION_CREATED", createdAt: { gte: entitlement.periodStart, lt: entitlement.periodEnd } },
      _sum: { units: true },
    }),
  ])
  return {
    ...entitlement,
    limits: OPTIMIZER_PLANS[entitlement.plan],
    usage: { projects, analyses: analyses._sum.units ?? 0, optimizations: optimizations._sum.units ?? 0 },
  }
}

export async function assertOptimizerUsageAllowed(userId: string, action: MeteredOptimizerAction) {
  const summary = await getOptimizerUsageSummary(userId)
  const key = action === "ARTICLE_ANALYZED" ? "analyses" : "optimizations"
  const limit = summary.limits[key]
  if (limit !== null && summary.usage[key] >= limit) {
    const error = new Error(`${summary.limits.name} plan limit reached for ${key}. Upgrade to continue.`)
    Object.assign(error, { code: "USAGE_LIMIT_REACHED", status: 429, plan: summary.plan, limit, used: summary.usage[key] })
    throw error
  }
  return summary
}

export async function assertOptimizerProjectAllowed(userId: string) {
  const summary = await getOptimizerUsageSummary(userId)
  const limit = summary.limits.projects
  if (limit !== null && summary.usage.projects >= limit) {
    const error = new Error(`${summary.limits.name} plan project limit reached. Upgrade to create another project.`)
    Object.assign(error, { code: "PROJECT_LIMIT_REACHED", status: 429, plan: summary.plan, limit, used: summary.usage.projects })
    throw error
  }
  return summary
}
