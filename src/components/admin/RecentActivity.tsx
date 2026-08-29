// src/components/admin/RecentActivity.tsx
"use client"

import { useEffect, useState } from "react"
import { 
  ShoppingCart,
  UserPlus,
  FileText,
  Star,
  GitCompare,
  Package,
  Clock
} from "lucide-react"
import Link from "next/link"

interface Activity {
  id: string
  type: "product" | "review" | "comparison" | "guide" | "affiliate" | "subscriber" | "bestof" | "statistic"
  action: "created" | "updated" | "published" | "clicked" | "subscribed"
  title: string
  url?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/admin/activity")
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "product": return <Package className="h-4 w-4" />
      case "review": return <Star className="h-4 w-4" />
      case "comparison": return <GitCompare className="h-4 w-4" />
      case "guide": return <FileText className="h-4 w-4" />
      case "affiliate": return <ShoppingCart className="h-4 w-4" />
      case "subscriber": return <UserPlus className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "product": return "text-blue-600 bg-blue-100"
      case "review": return "text-yellow-600 bg-yellow-100"
      case "comparison": return "text-purple-600 bg-purple-100"
      case "guide": return "text-green-600 bg-green-100"
      case "affiliate": return "text-pink-600 bg-pink-100"
      case "subscriber": return "text-teal-600 bg-teal-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        <Link href="/admin/activity" className="text-sm text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getColor(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.action === "created" && "Created "}
                  {activity.action === "updated" && "Updated "}
                  {activity.action === "published" && "Published "}
                  {activity.action === "clicked" && "Clicked "}
                  {activity.action === "subscribed" && "New subscriber "}
                  <span className="font-medium">
                    {activity.url ? (
                      <Link href={activity.url} className="hover:text-blue-600 hover:underline">
                        {activity.title}
                      </Link>
                    ) : (
                      activity.title
                    )}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
