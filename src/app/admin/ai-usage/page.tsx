// src/app/admin/ai-usage/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AIUsagePage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Usage & Costs</h1>
        <p className="text-gray-500">Monitor AI API usage and costs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Generations</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">$0.00</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">0%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Usage</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No AI usage data available yet.</p>
          <p className="text-sm mt-1">Start generating content to see usage data here.</p>
        </div>
      </div>
    </div>
  )
}
