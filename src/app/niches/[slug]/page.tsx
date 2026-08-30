// src/app/niches/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Package, Building2, Tag } from "lucide-react"

interface NichePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: NichePageProps) {
  const { slug } = await params
  const niche = await db.niche.findUnique({
    where: { slug, isActive: true },
  })

  if (!niche) {
    return {
      title: "Niche Not Found",
    }
  }

  return {
    title: `${niche.name} - Products & Reviews`,
    description: niche.description || `Explore products in the ${niche.name} niche`,
  }
}

export default async function NichePage({ params }: NichePageProps) {
  const { slug } = await params

  const niche = await db.niche.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
      brands: {
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true },
          },
        },
      },
      products: {
        where: { isActive: true },
        take: 10,
        include: {
          brand: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!niche) {
    notFound()
  }

  // Calculate total counts
  const totalProducts = niche.products?.length || 0
  const totalCategories = niche.categories?.length || 0
  const totalBrands = niche.brands?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{niche.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">{niche.name}</h1>
          {niche.description && (
            <p className="text-gray-600">{niche.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {totalProducts} Products
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {totalCategories} Categories
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {totalBrands} Brands
            </span>
          </div>
        </div>

        {/* Categories */}
        {niche.categories && niche.categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {niche.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category._count.products} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {niche.brands && niche.brands.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {niche.brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="font-medium">{brand.name}</h3>
                  <p className="text-sm text-gray-500">
                    {brand._count.products} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {niche.products && niche.products.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {niche.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500">{product.brand.name}</p>
                  )}
                  {product.price && (
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: product.currency || "USD",
                      }).format(product.price)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            {totalProducts > 10 && (
              <div className="mt-6 text-center">
                <Link
                  href={`/search?nicheId=${niche.id}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        )}

        {/* No Products */}
        {(!niche.products || niche.products.length === 0) && 
         (!niche.categories || niche.categories.length === 0) && 
         (!niche.brands || niche.brands.length === 0) && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No content found</h3>
            <p className="text-gray-500 mt-1">
              This niche doesn&apos;t have any products, categories, or brands yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
