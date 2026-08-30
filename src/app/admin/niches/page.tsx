// src/app/admin/niches/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

export default async function AdminNichesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  const page = parseInt(searchParams.page || "1")
  const limit = 20
  const offset = (page - 1) * limit
  const search = searchParams.search || ""

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const [niches, total] = await Promise.all([
    db.niche.findMany({
      where,
      include: {
        _count: {
          select: { categories: true, brands: true, products: true },
        },
      },
      orderBy: { name: "asc" },
      skip: offset,
      take: limit,
    }),
    db.niche.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Niches</h1>
          <p className="text-gray-500">Manage your niches</p>
        </div>
        <Link
          href="/admin/niches/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Niche
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search niches..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Niches Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brands
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {niches.map((niche) => (
                <tr key={niche.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{niche.name}</p>
                      {niche.description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {niche.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    /{niche.slug}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {niche._count.categories}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {niche._count.brands}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {niche._count.products}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/niches/${niche.slug}`}
                        target="_blank"
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/niches/${niche.id}/edit`}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this niche?")) {
                            await fetch(`/api/admin/niches?id=${niche.id}`, {
                              method: "DELETE",
                            })
                            window.location.reload()
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {Math.min(niches.length, limit)} of {total}
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/admin/niches?page=${i + 1}${search ? `&search=${search}` : ""}`}
                  className={`px-3 py-1 rounded-md text-sm ${
                    page === i + 1
                      ? "bg-[#1a1a2e] text-white"
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
    </div>
  )
}
