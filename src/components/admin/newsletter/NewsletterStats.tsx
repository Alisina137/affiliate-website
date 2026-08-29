// src/components/admin/newsletter/NewsletterStats.tsx
"use client"

import { useEffect, useState } from "react"
import { Users, Mail, Activity, TrendingUp } from "lucide-react"

interface Stats {
  total: number
  active: number
}

export function NewsletterStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/newsletter/stats")
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statItems = [
    {
      label: "Total Subscribers",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Active Subscribers",
      value: stats.active,
      icon: Mail,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Inactive",
      value: stats.total - stats.active,
      icon: Activity,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Growth Rate",
      value: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
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
