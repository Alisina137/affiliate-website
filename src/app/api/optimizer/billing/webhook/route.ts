import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { planFromStripePrice, verifyStripeSignature } from "@/lib/optimizer/billing/stripe"

export const runtime = "nodejs"

type StripeSubscription = {
  id: string
  customer: string
  status: string
  cancel_at_period_end?: boolean
  current_period_start?: number
  current_period_end?: number
  metadata?: Record<string, string>
  items?: { data?: Array<{ price?: { id?: string }; current_period_start?: number; current_period_end?: number }> }
}
type StripeEvent = { id: string; type: string; data?: { object?: StripeSubscription } }

function subscriptionStatus(value: string) {
  const map: Record<string, string> = {
    active: "ACTIVE", trialing: "TRIALING", past_due: "PAST_DUE", unpaid: "UNPAID",
    canceled: "CANCELED", incomplete: "INCOMPLETE", incomplete_expired: "EXPIRED", paused: "PAUSED",
  }
  return map[value] || value.toUpperCase()
}

function dateFromSeconds(value?: number) {
  return value ? new Date(value * 1000) : null
}

export async function POST(request: Request) {
  const raw = await request.text()
  if (!verifyStripeSignature(raw, request.headers.get("stripe-signature"))) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 })
  }

  const event = JSON.parse(raw) as StripeEvent
  if (!["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    return NextResponse.json({ received: true })
  }

  const subscription = event.data?.object
  if (!subscription?.id || !subscription.customer) return NextResponse.json({ error: "Invalid subscription event." }, { status: 400 })

  const item = subscription.items?.data?.[0]
  const userId = subscription.metadata?.userId
  const plan = planFromStripePrice(item?.price?.id) || (subscription.metadata?.plan as "STARTER" | "PRO" | "AGENCY" | undefined)
  if (!userId || !plan || !["STARTER", "PRO", "AGENCY"].includes(plan)) {
    return NextResponse.json({ error: "Optimizer subscription metadata or price mapping is invalid." }, { status: 400 })
  }

  const status = event.type === "customer.subscription.deleted" ? "CANCELED" : subscriptionStatus(subscription.status)
  await db.optimizerSubscription.upsert({
    where: { userId },
    create: {
      userId, module: "OPTIMIZER", provider: "STRIPE", providerCustomerId: subscription.customer,
      providerSubscriptionId: subscription.id, plan, status,
      currentPeriodStart: dateFromSeconds(subscription.current_period_start ?? item?.current_period_start),
      currentPeriodEnd: dateFromSeconds(subscription.current_period_end ?? item?.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
    update: {
      provider: "STRIPE", providerCustomerId: subscription.customer, providerSubscriptionId: subscription.id,
      plan, status,
      currentPeriodStart: dateFromSeconds(subscription.current_period_start ?? item?.current_period_start),
      currentPeriodEnd: dateFromSeconds(subscription.current_period_end ?? item?.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
  })

  return NextResponse.json({ received: true })
}
