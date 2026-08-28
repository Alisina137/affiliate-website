// src/app/categories/[slug]/page.tsx
import { notFound } from "next/navigation"
import { categoryService } from "@/services"
import { CategoryProducts } from "@/components/categories/CategoryProducts"
import { CategoryHeader } from "@/components/categories/CategoryHeader"
import { CategoryFilters } from "@/components/categories/CategoryFilters"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    brandId?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    page?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await categoryService.getBySlug(params.slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: category.seoTitle || `${category.name} - Products & Reviews`,
    description: category.metaDescription || category.description || `Browse the best ${category.name} products`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await categoryService.getBySlug(params.slug)

  if (!category) {
    notFound()
  }

  // Parse filters
  const brandId = searchParams.brandId
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined
  const sortBy = searchParams.sortBy || "createdAt"
  const sortOrder = searchParams.sortOrder || "desc"
  const page = parseInt(searchParams.page || "1")
  const limit = 12

  // Get products with filters
  const productsData = await categoryService.getProducts(category.id, {
    brandId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset: (page - 1) * limit,
  })

  // Get brands in this category
  const brands = await categoryService.getBrands(category.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <CategoryHeader category={category} />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Filters - Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilters
              categoryId={category.id}
              brands={brands}
              currentFilters={{
                brandId: searchParams.brandId,
                minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
                maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
                sortBy,
                sortOrder,
              }}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <CategoryProducts
              products={productsData.products}
              total={productsData.total}
              currentPage={productsData.page}
              totalPages={productsData.totalPages}
              limit={productsData.limit}
              categorySlug={category.slug}
              currentFilters={{
                brandId: searchParams.brandId,
                minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
                maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
                sortBy,
                sortOrder,
              }}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
