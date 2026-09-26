"use client"

import { useState } from "react"

export function BillingActions({ plan, current, billingConfigured, hasCustomer }: {
  plan: string
  current: boolean
  billingConfigured: boolean
  hasCustomer: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function open(path: string, body?: object) {
    setBusy(true); setError("")
    try {
      const response = await fetch(path, { method: "POST", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Billing request failed.")
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Billing request failed.")
      setBusy(false)
    }
  }

  if (current) {
    return <div className="mt-6">{hasCustomer ? <button disabled={busy} onClick={() => open("/api/optimizer/billing/portal")} className="w-full rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">{busy ? "Opening…" : "Manage billing"}</button> : <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">Your current optimizer plan.</div>}{error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}</div>
  }

  if (plan === "FREE") return <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">Free is the default plan when no paid subscription is active.</div>
  if (!billingConfigured) return <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">Checkout becomes available after Stripe billing is configured.</div>

  return <div className="mt-6"><button disabled={busy} onClick={() => open("/api/optimizer/billing/checkout", { plan })} className="w-full rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d2d44] disabled:opacity-50">{busy ? "Opening checkout…" : `Choose ${plan.charAt(0) + plan.slice(1).toLowerCase()}`}</button>{error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}</div>
}
