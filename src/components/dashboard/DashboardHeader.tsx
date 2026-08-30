// src/components/dashboard/DashboardHeader.tsx
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ArrowLeft, LogOut, ChevronDown, Settings, Home } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="border-b border-gray-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors group touch-target">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xs:inline">Back to</span>
              <span className="font-medium text-[#1a1a2e]">Affiliate</span>
            </Link>
            <span className="text-gray-300 hidden xs:inline">/</span>
            <span className="text-sm font-medium text-[#1a1a2e] hidden xs:inline">Dashboard</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors touch-target" aria-label="Home">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </Link>

            {session && (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors touch-target">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                    {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                  </div>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[#1a1a2e] truncate">{session.user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors touch-target" onClick={() => setIsDropdownOpen(false)}>
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors border-t border-gray-100 touch-target">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
