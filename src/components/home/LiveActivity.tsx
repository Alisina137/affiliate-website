// src/components/home/LiveActivity.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Activity, 
  Star, 
  Package,
  GitCompare,
  BookOpen,
  ArrowRight
} from "lucide-react"

interface ActivityItem {
  id: string
  type: "review" | "product" | "comparison" | "guide"
  title: string
  slug: string
  timestamp: Date
  user: string
}

export function LiveActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/activity/live")
      .then(res => res.json())
      .then(data => {
        setActivities(data.slice(0, 5))
        setIsLoading(false)
      })
      .catch(() => {
        setActivities([
          {
            id: "1",
            type: "review",
            title: "MacBook Pro Review",
            slug: "macbook-pro-review",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            user: "Sarah"
          },
          {
            id: "2",
            type: "comparison",
            title: "iPhone vs Samsung",
            slug: "iphone-vs-samsung",
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            user: "Michael"
          },
          {
            id: "3",
            type: "product",
            title: "Sony WH-1000XM5",
            slug: "sony-wh-1000xm5",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            user: "Emily"
          }
        ])
        setIsLoading(false)
      })
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "review": return <Star className="h-4 w-4 text-yellow-500" />
      case "comparison": return <GitCompare className="h-4 w-4 text-purple-500" />
      case "guide": return <BookOpen className="h-4 w-4 text-green-500" />
      default: return <Package className="h-4 w-4 text-blue-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "review": return "New Review"
      case "comparison": return "New Comparison"
      case "guide": return "New Guide"
      default: return "New Product"
    }
  }

  const getUrl = (type: string, slug: string) => {
    switch (type) {
      case "review": return `/reviews/${slug}`
      case "comparison": return `/comparisons/${slug}`
      case "guide": return `/guides/${slug}`
      default: return `/products/${slug}`
    }
  }

  const formatTime = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (isLoading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
            <h3 className="font-semibold text-gray-900">Live Activity</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="space-y-3">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={getUrl(activity.type, activity.slug)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{getTypeLabel(activity.type)}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {activity.title}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
