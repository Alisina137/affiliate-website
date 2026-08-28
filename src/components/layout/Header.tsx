// src/components/layout/Header.tsx
import Link from "next/link"
import { Search, Menu } from "lucide-react"  // Removed X
import { AuthStatus } from "@/components/auth"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">Affiliate</span>
          <span className="text-xl font-bold">Platform</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/categories" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Categories
          </Link>
          <Link href="/reviews" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Reviews
          </Link>
          <Link href="/comparisons" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Comparisons
          </Link>
          <Link href="/guides" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Guides
          </Link>
          <Link href="/best" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Best Of
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Auth Status */}
          <AuthStatus />

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
