// src/app/admin/brands/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Plus, Search, Edit, Trash2, Eye, Building2 } from "lucide-react"

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const page = parseInt(searchParams.page || "1")
  const limit = 10
  const offset = (page - 1) * limit
  const search = searchParams.search || ""

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const [brands, total] = await Promise.all([
    db.brand.findMany({
      where,
      include: {
        niche: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
      skip: offset,
      take: limit,
    }),
    db.brand.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500">Manage product brands</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Brand
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search brands..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {/* Brands Grid */}
      {brands.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No brands found</h3>
          <p className="text-gray-500 mt-1">Get started by creating your first brand.</p>
          <Link
            href="/admin/brands/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Brand
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 object-contain rounded-lg bg-gray-50"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500">
                      {brand._count.products} products
                    </p>
                    {brand.niche && (
                      <p className="text-xs text-gray-400">{brand.niche.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/brands/${brand.slug}`}
                    target="_blank"
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/brands/${brand.id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {brand.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {brand.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${
                  brand.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {brand.isActive ? "Active" : "Inactive"}
                </span>
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {Math.min(brands.length, limit)} of {total}
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/admin/brands?page=${i + 1}${search ? `&search=${search}` : ""}`}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
