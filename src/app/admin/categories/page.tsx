// src/app/admin/categories/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Plus, Search, Edit, Trash2, Eye, FolderTree } from "lucide-react"

export default async function AdminCategoriesPage({
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

  const [categories, total] = await Promise.all([
    db.category.findMany({
      where,
      include: {
        niche: true,
        parent: true,
        children: {
          where: { isActive: true },
          take: 3,
        },
        _count: {
          select: { products: true, children: true },
        },
      },
      orderBy: [{ nicheId: "asc" }, { order: "asc" }, { name: "asc" }],
      skip: offset,
      take: limit,
    }),
    db.category.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Organize products into categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search categories..."
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

      {/* Categories Table */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FolderTree className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
          <p className="text-gray-500 mt-1">Get started by creating your first category.</p>
          <Link
            href="/admin/categories/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Category
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niche
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">/{category.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {category.niche?.name || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {category.parent?.name || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {category._count.products}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {category._count.children}
                      {category.children.length > 0 && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({category.children.map(c => c.name).join(", ")})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/categories/${category.slug}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
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
                Showing {Math.min(categories.length, limit)} of {total}
              </p>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Link
                    key={i}
                    href={`/admin/categories?page=${i + 1}${search ? `&search=${search}` : ""}`}
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
      )}
    </div>
  )
}
