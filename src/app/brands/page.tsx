// src/app/brands/page.tsx
import Link from "next/link"
import Image from "next/image"
import { brandService } from "@/services"
import { Building2 } from "lucide-react"

export const metadata = {
  title: "Brands",
  description: "Browse products by brand",
}

export default async function BrandsPage() {
  const { data: brands, total } = await brandService.getAll({
    limit: 24,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Brands</h1>
        <p className="text-gray-600 mb-8">Browse products by brand</p>

        {brands && brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-300 text-center"
              >
                {brand.logo ? (
                  <div className="relative h-16 w-16 mx-auto mb-3">
                    <Image 
                      src={brand.logo} 
                      alt={brand.name} 
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
                {brand._count && (
                  <p className="text-sm text-gray-500 mt-1">
                    {brand._count.products} products
                  </p>
                )}
                {brand.niche && (
                  <p className="text-xs text-gray-400 mt-1">{brand.niche.name}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No brands available yet.</p>
          </div>
        )}

        {total > 24 && (
          <div className="mt-8 text-center">
            <Link
              href="/brands?page=2"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Load More
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
