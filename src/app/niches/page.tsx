// src/app/niches/page.tsx
import Link from "next/link"
import { db } from "@/lib/db"
import { Package } from "lucide-react"

export const metadata = {
  title: "Niches",
  description: "Browse products by niche",
}

export default async function NichesPage() {
  const niches = await db.niche.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          products: true,
          categories: true,
          brands: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Niches</h1>
        <p className="text-gray-600 mb-8">Browse products by niche</p>

        {niches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No niches available</h3>
            <p className="text-gray-500 mt-1">Check back later for new niches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {niches.map((niche) => (
              <Link
                key={niche.id}
                href={`/niches/${niche.slug}`}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-lg transition-all duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{niche.name}</h2>
                {niche.description && (
                  <p className="text-gray-600 text-sm mb-3">{niche.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>{niche._count.products} products</span>
                  <span>•</span>
                  <span>{niche._count.categories} categories</span>
                  <span>•</span>
                  <span>{niche._count.brands} brands</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
