import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { appUrl, stripeRequest } from "@/lib/optimizer/billing/stripe"

export const runtime = "nodejs"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const subscription = await db.optimizerSubscription.findUnique({ where: { userId: session.user.id } })
  if (!subscription?.providerCustomerId) return NextResponse.json({ error: "No billing customer exists for this account." }, { status: 404 })

  const params = new URLSearchParams({ customer: subscription.providerCustomerId, return_url: `${appUrl()}/dashboard/optimizer/billing` })
  const portal = await stripeRequest<{ url: string }>("/billing_portal/sessions", params)
  return NextResponse.json({ url: portal.url })
}
