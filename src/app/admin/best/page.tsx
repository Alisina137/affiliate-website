// src/app/admin/best/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default async function AdminBestOfPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }
 
  const page = parseInt(searchParams.page || "1")
  const limit = 10
  const offset = (page - 1) * limit
  const search = searchParams.search || ""
  const statusFilter = searchParams.status || ""

  const where: Prisma.BestOfWhereInput = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ]
  }
  if (statusFilter) {
    where.status = statusFilter
  }

  const [bestOfs, total] = await Promise.all([
    db.bestOf.findMany({
      where,
      include: {
        category: true,
        entries: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    db.bestOf.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)
  const statusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Best Of</h1>
          <p className="text-gray-500">Manage best-of lists</p>
        </div>
        <Link
          href="/admin/best/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Best Of
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <form className="flex flex-1 gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search best-of lists..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            defaultValue={statusFilter}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>
      </div>

      {/* Best Of Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bestOfs.map((bestOf) => (
                <tr key={bestOf.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{bestOf.title}</p>
                      <p className="text-xs text-gray-500">/{bestOf.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {bestOf.category?.name || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {bestOf.entries.length} products
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      bestOf.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : bestOf.status === "ARCHIVED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {bestOf.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {bestOf.views}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {bestOf.status === "PUBLISHED" && (
                        <Link
                          href={`/best/${bestOf.slug}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/best/${bestOf.id}/edit`}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
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
              Showing {Math.min(bestOfs.length, limit)} of {total}
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/admin/best?page=${i + 1}${search ? `&search=${search}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`}
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
    </div>
  )
}
