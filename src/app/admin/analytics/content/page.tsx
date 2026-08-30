// src/app/admin/analytics/content/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ContentAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Performance</h1>
        <p className="text-gray-500">Track your content performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Articles</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Avg. Views per Article</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Content</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No content data available yet.</p>
          <p className="text-sm mt-1">Start publishing content to see data here.</p>
        </div>
      </div>
    </div>
  )
}
