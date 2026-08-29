// src/components/admin/DashboardStats.tsx
"use client"

import { useEffect, useState } from "react"
import { 
  Package, 
  Star, 
  Link2, 
  Users, 
  TrendingUp, 
  Eye,
  ShoppingCart,
  FileText
} from "lucide-react"

interface StatsData {
  totalProducts: number
  totalReviews: number
  totalComparisons: number
  totalGuides: number
  totalAffiliateLinks: number
  totalAffiliateClicks: number
  totalSubscribers: number
  totalViews: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statItems = [
    {
      label: "Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Comparisons",
      value: stats.totalComparisons,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Guides",
      value: stats.totalGuides,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Affiliate Links",
      value: stats.totalAffiliateLinks,
      icon: Link2,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Affiliate Clicks",
      value: stats.totalAffiliateClicks,
      icon: ShoppingCart,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      label: "Subscribers",
      value: stats.totalSubscribers,
      icon: Users,
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {item.value.toLocaleString()}
              </p>
            </div>
            <div className={`${item.bg} p-3 rounded-lg`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
