// src/components/categories/CategoryHeader.tsx
import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

interface CategoryHeaderProps {
  category: {
    id: string
    name: string
    slug: string
    description?: string | null
    image?: string | null
    parent?: {
      name: string
      slug: string
    } | null
    niche?: {
      name: string
      slug: string
    } | null
    children?: {
      id: string
      name: string
      slug: string
      order: number
    }[]
  }
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
          <Home className="h-4 w-4" />
          Home
        </Link>
        {category.niche && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/niches/${category.niche.slug}`} className="hover:text-blue-600">
              {category.niche.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      {/* Category Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        )}

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Subcategories
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
