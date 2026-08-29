// src/components/admin/QuickActions.tsx
"use client"

import Link from "next/link"
import { 
  Plus, 
  Package, 
  Star, 
  GitCompare, 
  BookOpen,
  Link2,
  Sparkles,
  Mail
} from "lucide-react"

interface QuickAction {
  label: string
  icon: React.ReactNode
  href: string
  color: string
  bg: string
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: "New Product",
      icon: <Plus className="h-4 w-4" />,
      href: "/admin/products/new",
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "New Review",
      icon: <Star className="h-4 w-4" />,
      href: "/admin/reviews/new",
      color: "text-yellow-600",
      bg: "bg-yellow-50 hover:bg-yellow-100",
    },
    {
      label: "New Comparison",
      icon: <GitCompare className="h-4 w-4" />,
      href: "/admin/comparisons/new",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
    },
    {
      label: "New Guide",
      icon: <BookOpen className="h-4 w-4" />,
      href: "/admin/guides/new",
      color: "text-green-600",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      label: "Manage Products",
      icon: <Package className="h-4 w-4" />,
      href: "/admin/products",
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "Affiliate Links",
      icon: <Link2 className="h-4 w-4" />,
      href: "/admin/affiliate-links",
      color: "text-orange-600",
      bg: "bg-orange-50 hover:bg-orange-100",
    },
    {
      label: "AI Content Studio",
      icon: <Sparkles className="h-4 w-4" />,
      href: "/admin/ai-content",
      color: "text-indigo-600",
      bg: "bg-indigo-50 hover:bg-indigo-100",
    },
    {
      label: "Newsletter",
      icon: <Mail className="h-4 w-4" />,
      href: "/admin/newsletter",
      color: "text-teal-600",
      bg: "bg-teal-50 hover:bg-teal-100",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${action.bg} ${action.color}`}
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
