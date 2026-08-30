// src/app/admin/activity/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Eye, 
  MousePointerClick, 
  ShoppingCart, 
  User, 
  Mail,
  Plus,
  Edit,
  Trash2
} from "lucide-react"

interface Activity {
  id: string
  type: string
  description: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const limit = 20

  useEffect(() => {
    fetchActivities()
  }, [filter])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/activity?type=${filter}&limit=${limit}`)
      const data = await response.json()
      setActivities(data.data || [])
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "page_view":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "affiliate_click":
        return <MousePointerClick className="h-4 w-4 text-green-500" />
      case "product_view":
        return <ShoppingCart className="h-4 w-4 text-purple-500" />
      case "user_login":
        return <User className="h-4 w-4 text-indigo-500" />
      case "newsletter_signup":
        return <Mail className="h-4 w-4 text-pink-500" />
      case "create":
        return <Plus className="h-4 w-4 text-emerald-500" />
      case "edit":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      default:
        return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "page_view":
        return "bg-blue-50 border-blue-200"
      case "affiliate_click":
        return "bg-green-50 border-green-200"
      case "product_view":
        return "bg-purple-50 border-purple-200"
      case "user_login":
        return "bg-indigo-50 border-indigo-200"
      case "newsletter_signup":
        return "bg-pink-50 border-pink-200"
      case "create":
        return "bg-emerald-50 border-emerald-200"
      case "edit":
        return "bg-blue-50 border-blue-200"
      case "delete":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
          <p className="text-gray-500">View all user activity across the platform</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("page_view")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === "page_view"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Page Views
        </button>
        <button
          onClick={() => setFilter("affiliate_click")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === "affiliate_click"
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Affiliate Clicks
        </button>
        <button
          onClick={() => setFilter("product_view")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === "product_view"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Product Views
        </button>
        <button
          onClick={() => setFilter("newsletter_signup")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === "newsletter_signup"
              ? "bg-pink-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Newsletter Signups
        </button>
      </div>

      {/* Activities List */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No activity found</h3>
          <p className="text-gray-500 mt-1">No activities match your current filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`border rounded-lg p-4 ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user.name || activity.user.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
