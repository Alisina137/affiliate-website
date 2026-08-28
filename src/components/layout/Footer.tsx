// src/components/layout/Footer.tsx
"use client"

import Link from "next/link"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Newsletter Section - Only visible on larger screens */}
        <div className="hidden md:block py-8 border-b">
          <NewsletterSignup />
        </div>

        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold mb-4">Affiliate Platform</h3>
              <p className="text-sm text-gray-600">
                Helping you find the best products for your needs.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
                <li><Link href="/categories" className="text-gray-600 hover:text-blue-600">Categories</Link></li>
                <li><Link href="/reviews" className="text-gray-600 hover:text-blue-600">Reviews</Link></li>
                <li><Link href="/guides" className="text-gray-600 hover:text-blue-600">Guides</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
                <li><Link href="/disclosure" className="text-gray-600 hover:text-blue-600">Affiliate Disclosure</Link></li>
              </ul>
            </div>

            {/* Newsletter - Mobile */}
            <div className="md:hidden">
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-600 mb-2">
                Subscribe for updates and exclusive content.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Affiliate Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
