// src/components/layout/Footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-semibold text-[#1a1a2e] mb-3">Affiliate</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Research, compare, and find the best products.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/categories" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Categories</Link></li>
              <li><Link href="/reviews" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Reviews</Link></li>
              <li><Link href="/guides" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">About</Link></li>
              <li><Link href="/editorial-policy" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Editorial Policy</Link></li>
              <li><Link href="/contact" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Privacy</Link></li>
              <li><Link href="/terms" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Terms</Link></li>
              <li><Link href="/disclosure" className="text-xs sm:text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors touch-target inline-flex items-center">Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200/60 text-center text-xs sm:text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Affiliate. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
