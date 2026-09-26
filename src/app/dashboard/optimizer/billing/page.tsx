import { auth } from "@/lib/auth"
import { getOptimizerUsageSummary } from "@/lib/optimizer/entitlements"
import { OPTIMIZER_PLANS } from "@/lib/optimizer/plans"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function OptimizerBillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const summary = await getOptimizerUsageSummary(session.user.id)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard/optimizer" className="text-sm font-medium text-indigo-600">← Optimizer dashboard</Link>
        <p className="mt-5 text-sm font-semibold text-indigo-600">Affiliate Optimizer</p>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Plan & usage</h1>
        <p className="mt-2 text-gray-600">Optimizer plans are independent from other Affiliate modules. Usage resets with the active billing period.</p>
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="text-sm text-gray-500">Current plan</p><p className="text-2xl font-bold text-[#1a1a2e]">{summary.limits.name}</p></div>
          <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{summary.status}</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Usage label="Projects" used={summary.usage.projects} limit={summary.limits.projects} />
          <Usage label="Analyses" used={summary.usage.analyses} limit={summary.limits.analyses} />
          <Usage label="AI rewrites" used={summary.usage.optimizations} limit={summary.limits.optimizations} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(OPTIMIZER_PLANS).map(([key, plan]) => (
          <section key={key} className={`rounded-xl border bg-white p-5 ${key === summary.plan ? "border-indigo-400 ring-1 ring-indigo-100" : "border-gray-200"}`}>
            <h2 className="text-lg font-bold text-[#1a1a2e]">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-[#1a1a2e]">${plan.priceMonthly}<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-5 space-y-2 text-sm text-gray-600">
              <li>{plan.projects ?? "Unlimited"} projects</li>
              <li>{plan.analyses} analyses/month</li>
              <li>{plan.optimizations.toLocaleString()} AI rewrites/month</li>
            </ul>
            <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500">
              {key === summary.plan ? "Your current optimizer plan." : "Checkout is not enabled until a payment provider is configured."}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

function Usage({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const text = limit === null ? `${used} used · Unlimited` : `${used} of ${limit} used`
  const width = limit === null ? 0 : Math.min(100, Math.round((used / Math.max(1, limit)) * 100))
  return <div><div className="flex justify-between text-sm"><span className="font-medium text-gray-700">{label}</span><span className="text-gray-500">{text}</span></div>{limit !== null && <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full bg-[#1a1a2e]" style={{ width: `${width}%` }} /></div>}</div>
}
