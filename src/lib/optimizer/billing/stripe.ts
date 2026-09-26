import { createHmac, timingSafeEqual } from "node:crypto"
import { isOptimizerPlan, type OptimizerPlan } from "../plans"

const STRIPE_API = "https://api.stripe.com/v1"
const paidPlans = ["STARTER", "PRO", "AGENCY"] as const
export type PaidOptimizerPlan = (typeof paidPlans)[number]

export function isPaidOptimizerPlan(value: unknown): value is PaidOptimizerPlan {
  return typeof value === "string" && paidPlans.includes(value as PaidOptimizerPlan)
}

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.STRIPE_OPTIMIZER_STARTER_PRICE_ID && process.env.STRIPE_OPTIMIZER_PRO_PRICE_ID &&
    process.env.STRIPE_OPTIMIZER_AGENCY_PRICE_ID)
}

export function stripePriceId(plan: PaidOptimizerPlan) {
  const ids = {
    STARTER: process.env.STRIPE_OPTIMIZER_STARTER_PRICE_ID,
    PRO: process.env.STRIPE_OPTIMIZER_PRO_PRICE_ID,
    AGENCY: process.env.STRIPE_OPTIMIZER_AGENCY_PRICE_ID,
  }
  const value = ids[plan]
  if (!value) throw new Error(`Stripe price ID is not configured for ${plan}.`)
  return value
}

export function planFromStripePrice(priceId: string | null | undefined): OptimizerPlan | null {
  if (!priceId) return null
  const match = paidPlans.find((plan) => process.env[`STRIPE_OPTIMIZER_${plan}_PRICE_ID`] === priceId)
  return match && isOptimizerPlan(match) ? match : null
}

function secret() {
  const value = process.env.STRIPE_SECRET_KEY
  if (!value) throw new Error("Stripe is not configured.")
  return value
}

export async function stripeRequest<T>(path: string, body?: URLSearchParams): Promise<T> {
  const response = await fetch(`${STRIPE_API}${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${secret()}`, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
    body,
    cache: "no-store",
  })
  const payload = await response.json() as T & { error?: { message?: string } }
  if (!response.ok) throw new Error(payload.error?.message || "Stripe request failed.")
  return payload
}

export function appUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL
  if (!raw) throw new Error("NEXT_PUBLIC_SITE_URL or NEXTAUTH_URL must be configured.")
  return raw.replace(/\/$/, "")
}

export function verifyStripeSignature(payload: string, signature: string | null, now = Date.now()) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || !signature) return false
  const parts = signature.split(",")
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2)
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3))
  if (!timestamp || signatures.length === 0 || Math.abs(now / 1000 - Number(timestamp)) > 300) return false
  const expected = createHmac("sha256", webhookSecret).update(`${timestamp}.${payload}`).digest("hex")
  return signatures.some((candidate) => {
    if (candidate.length !== expected.length) return false
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected))
  })
}
