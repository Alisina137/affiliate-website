// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { 
  User, 
  Mail, 
  Eye, 
  Heart, 
  ShoppingCart,
  Settings,
  ArrowRight,
  Star,
  Clock,
  Package,
  Search
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  const stats = {
    views: 0,
    saved: 0,
    orders: 0,
    reviews: 0,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Welcome Section */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-medium shadow-sm">
            {user.name?.[0] || user.email[0]}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">
              Welcome back, {user.name || "User"}
            </h1>
            <p className="text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.role === "ADMIN" && (
              <span className="inline-block mt-1 text-xs bg-[#1a1a2e] text-white px-2 py-0.5 rounded">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
        <div className="stat-card">
          <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a1a2e] mx-auto mb-2" />
          <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">{stats.views}</p>
          <p className="text-xs text-gray-500">Products viewed</p>
        </div>
        <div className="stat-card">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a1a2e] mx-auto mb-2" />
          <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">{stats.saved}</p>
          <p className="text-xs text-gray-500">Saved products</p>
        </div>
        <div className="stat-card">
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a1a2e] mx-auto mb-2" />
          <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">{stats.orders}</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>
        <div className="stat-card">
          <Star className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a1a2e] mx-auto mb-2" />
          <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">{stats.reviews}</p>
          <p className="text-xs text-gray-500">Reviews written</p>
        </div>
      </div>

      {/* Quick Actions & Account Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* Quick Actions */}
        <div className="card-elevated p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/search"
              className="flex items-center justify-between p-3 border border-gray-200/60 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group card-premium"
            >
              <span className="flex items-center gap-2 text-sm text-[#1a1a2e]">
                <Search className="h-4 w-4" />
                Find Products
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#1a1a2e] transition-colors" />
            </Link>
            <Link
              href="/categories"
              className="flex items-center justify-between p-3 border border-gray-200/60 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group card-premium"
            >
              <span className="flex items-center gap-2 text-sm text-[#1a1a2e]">
                <Package className="h-4 w-4" />
                Browse Categories
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#1a1a2e] transition-colors" />
            </Link>
            <Link
              href="/best"
              className="flex items-center justify-between p-3 border border-gray-200/60 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group card-premium"
            >
              <span className="flex items-center gap-2 text-sm text-[#1a1a2e]">
                <Star className="h-4 w-4" />
                Best Of Lists
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#1a1a2e] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Account Settings */}
        <div className="card-elevated p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4">Account Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border border-gray-200/60 rounded-lg card-premium">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-[#1a1a2e]">{user.name || "Not set"}</p>
                <p className="text-xs text-gray-500">Name</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200/60 rounded-lg card-premium">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-[#1a1a2e]">{user.email}</p>
                <p className="text-xs text-gray-500">Email</p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center justify-between p-3 border border-gray-200/60 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group card-premium"
            >
              <span className="flex items-center gap-2 text-sm text-[#1a1a2e]">
                <Settings className="h-4 w-4" />
                Edit Profile
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#1a1a2e] transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-elevated p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4">Recent Activity</h3>
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1a1a2e]">No recent activity</p>
          <p className="text-xs text-gray-400 mt-1">Start browsing products to see your activity here.</p>
        </div>
      </div>
    </div>
  )
}
