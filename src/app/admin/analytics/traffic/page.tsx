// src/app/admin/analytics/traffic/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TrafficAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Traffic Analytics</h1>
        <p className="text-gray-500">Monitor your site traffic</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Visitors</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Page Views</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Bounce Rate</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Avg. Session</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0m 0s</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No traffic data available yet.</p>
          <p className="text-sm mt-1">Start tracking analytics to see data here.</p>
        </div>
      </div>
    </div>
  )
}
