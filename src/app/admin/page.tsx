// src/app/admin/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardStats } from "@/components/admin/DashboardStats"
import { RecentActivity } from "@/components/admin/RecentActivity"
import { QuickActions } from "@/components/admin/QuickActions"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {session.user.name || "Admin"}!</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

