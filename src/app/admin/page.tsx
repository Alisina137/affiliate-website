// src/app/admin/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome to the admin dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Subscribers</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Reviews</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Affiliate Links</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}
