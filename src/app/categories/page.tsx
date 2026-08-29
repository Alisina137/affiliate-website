// src/app/categories/page.tsx
import Link from "next/link"
import { categoryService } from "@/services"
import { Package, ChevronRight } from "lucide-react"

export const metadata = {
  title: "All Categories",
  description: "Browse products by category",
}

export default async function CategoriesPage() {
  const categories = await categoryService.getAll()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">All Categories</h1>
        <p className="text-gray-600 mb-8">Browse products by category</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                    <span>{category.products?.length || 0} products</span>
                    {category.children && category.children.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{category.children.length} subcategories</span>
                      </>
                    )}
                  </div>
                  {category.children && category.children.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {category.children.slice(0, 3).map((child) => (
                        <span
                          key={child.id}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full"
                        >
                          {child.name}
                        </span>
                      ))}
                      {category.children.length > 3 && (
                        <span className="px-2 py-0.5 text-xs text-gray-500">
                          +{category.children.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Categories Found</h3>
            <p className="text-gray-400">Categories will appear here once they are added.</p>
          </div>
        )}
      </div>
    </div>
  )
}
