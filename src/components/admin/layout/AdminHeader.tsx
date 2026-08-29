// src/components/admin/layout/AdminHeader.tsx
"use client"

import { useSession, signOut } from "next-auth/react"
import { Bell, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

export function AdminHeader() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.[0] || "A"}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              {session?.user?.name || "Admin"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
