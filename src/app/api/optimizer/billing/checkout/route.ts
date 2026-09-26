import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { appUrl, isPaidOptimizerPlan, stripeConfigured, stripePriceId, stripeRequest } from "@/lib/optimizer/billing/stripe"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!stripeConfigured()) return NextResponse.json({ error: "Billing is not configured." }, { status: 503 })

  const body = await request.json().catch(() => null) as { plan?: unknown } | null
  if (!isPaidOptimizerPlan(body?.plan)) return NextResponse.json({ error: "Choose a valid paid Optimizer plan." }, { status: 400 })

  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { email: true, optimizerSubscription: true } })
  if (!user?.email) return NextResponse.json({ error: "A verified account email is required." }, { status: 400 })
  if (user.optimizerSubscription?.providerCustomerId && ["ACTIVE", "TRIALING", "PAST_DUE"].includes(user.optimizerSubscription.status)) {
    return NextResponse.json({ error: "Manage your existing subscription from the billing portal." }, { status: 409 })
  }

  const params = new URLSearchParams()
  params.set("mode", "subscription")
  params.set("line_items[0][price]", stripePriceId(body.plan))
  params.set("line_items[0][quantity]", "1")
  params.set("success_url", `${appUrl()}/dashboard/optimizer/billing?checkout=success`)
  params.set("cancel_url", `${appUrl()}/dashboard/optimizer/billing?checkout=cancelled`)
  params.set("client_reference_id", session.user.id)
  params.set("metadata[userId]", session.user.id)
  params.set("metadata[module]", "OPTIMIZER")
  params.set("metadata[plan]", body.plan)
  params.set("subscription_data[metadata][userId]", session.user.id)
  params.set("subscription_data[metadata][module]", "OPTIMIZER")
  params.set("subscription_data[metadata][plan]", body.plan)
  if (user.optimizerSubscription?.providerCustomerId) params.set("customer", user.optimizerSubscription.providerCustomerId)
  else params.set("customer_email", user.email)

  const checkout = await stripeRequest<{ url: string | null }>("/checkout/sessions", params)
  if (!checkout.url) return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 })
  return NextResponse.json({ url: checkout.url })
}
