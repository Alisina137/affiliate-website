// src/app/admin/analytics/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500">Track your site performance and user behavior</p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}
