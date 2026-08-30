// src/components/layout/Header.tsx
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Search, Menu, LogOut, User, ChevronDown, Settings, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="text-base sm:text-xl font-bold tracking-tight text-[#1a1a2e]">Affiliate</span>
            <span className="text-sm sm:text-xl font-light text-gray-400">/</span>
            <span className="text-xs sm:text-sm font-light text-gray-500 hidden xs:inline">Platform</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/categories" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors">
              Categories
            </Link>
            <Link href="/reviews" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors">
              Reviews
            </Link>
            <Link href="/comparisons" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors">
              Comparisons
            </Link>
            <Link href="/guides" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors">
              Guides
            </Link>
            <Link href="/best" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors">
              Best Of
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link 
              href="/search" 
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors touch-target flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors touch-target"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                    {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                  </div>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[#1a1a2e] truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors touch-target"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors touch-target"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors border-t border-gray-100 touch-target"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors px-2 sm:px-3 py-1.5 touch-target"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-xs sm:text-sm bg-[#1a1a2e] text-white px-3 sm:px-4 py-1.5 rounded-lg hover:bg-[#2d2d44] transition-colors touch-target shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-3">
            <Link href="/categories" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors py-2 touch-target" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            <Link href="/reviews" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors py-2 touch-target" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link>
            <Link href="/comparisons" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors py-2 touch-target" onClick={() => setIsMobileMenuOpen(false)}>Comparisons</Link>
            <Link href="/guides" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors py-2 touch-target" onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
            <Link href="/best" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors py-2 touch-target" onClick={() => setIsMobileMenuOpen(false)}>Best Of</Link>
          </nav>
          {session ? (
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-red-500 font-medium py-2 touch-target w-full border-t border-gray-100 pt-4">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          ) : (
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <Link href="/login" className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors py-2 touch-target text-center" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link href="/register" className="text-sm bg-[#1a1a2e] text-white px-4 py-3 rounded-lg hover:bg-[#2d2d44] transition-colors text-center touch-target shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
