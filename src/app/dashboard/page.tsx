// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/auth"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <SignOutButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="font-semibold">Welcome, {session.user.name || session.user.email}</h3>
            <p className="text-sm text-gray-500">Role: {session.user.role}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-sm text-gray-500">Create content, manage products</p>
          </div>
        </div>
      </div>
    </div>
  )
}
