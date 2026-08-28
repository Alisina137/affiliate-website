// src/components/products/ProductCategoryNav.tsx
"use client"

import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductCategoryNavProps {
  category: Category | null
  productName: string
}

export function ProductCategoryNav({ category, productName }: ProductCategoryNavProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/categories" className="hover:text-blue-600">
        Categories
      </Link>
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/categories/${category.slug}`}
            className="hover:text-blue-600"
          >
            {category.name}
          </Link>
        </>
      )}
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 font-medium line-clamp-1">{productName}</span>
    </nav>
  )
}
