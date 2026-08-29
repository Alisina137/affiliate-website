// src/app/admin/affiliate-programs/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Plus, Search, Edit, Trash2, Building2, Users } from "lucide-react"

export default async function AdminAffiliateProgramsPage({
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

  const [programs, total] = await Promise.all([
    db.affiliateProgram.findMany({
      where,
      include: {
        merchants: {
          where: { isActive: true },
          include: {
            _count: {
              select: { affiliateLinks: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
      skip: offset,
      take: limit,
    }),
    db.affiliateProgram.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Programs</h1>
          <p className="text-gray-500">Manage affiliate programs and merchants</p>
        </div>
        <Link
          href="/admin/affiliate-programs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Program
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search programs..."
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

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No programs found</h3>
          <p className="text-gray-500 mt-1">Get started by creating your first affiliate program.</p>
          <Link
            href="/admin/affiliate-programs/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Program
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{program.name}</h3>
                  {program.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {program.merchants.length} merchants
                    </span>
                    {program.commission && (
                      <span>Commission: {program.commission}</span>
                    )}
                    {program.cookieDuration && (
                      <span>{program.cookieDuration} day cookie</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/affiliate-programs/${program.id}/edit`}
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
              {program.merchants.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchants
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {program.merchants.slice(0, 5).map((merchant) => (
                      <span
                        key={merchant.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 rounded-full"
                      >
                        {merchant.name}
                        <span className="text-gray-400">
                          ({merchant._count.affiliateLinks})
                        </span>
                      </span>
                    ))}
                    {program.merchants.length > 5 && (
                      <span className="px-2 py-0.5 text-xs text-gray-400">
                        +{program.merchants.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {Math.min(programs.length, limit)} of {total}
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={`/admin/affiliate-programs?page=${i + 1}${search ? `&search=${search}` : ""}`}
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
