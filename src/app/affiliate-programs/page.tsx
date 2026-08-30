// src/app/affiliate-programs/page.tsx
import Link from "next/link"
import { db } from "@/lib/db"
import { Building2 } from "lucide-react"

export const metadata = {
  title: "Affiliate Programs",
  description: "Browse all affiliate programs",
}

export default async function AffiliateProgramsPage() {
  const programs = await db.affiliateProgram.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Affiliate Programs</h1>
        <p className="text-gray-600 mb-8">Browse all affiliate programs</p>

        {programs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No affiliate programs available</h3>
            <p className="text-gray-500 mt-1">Check back later for new affiliate programs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/affiliate-programs/${program.slug}`}
                className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {program.logo ? (
                    <img
                      src={program.logo}
                      alt={program.name}
                      className="w-10 h-10 object-contain rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    {program.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{program.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    program.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {program.isActive ? "Active" : "Inactive"}
                  </span>
                  {program.commission && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {program.commission}% commission
                    </span>
                  )}
                  {program.cookieDuration && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {program.cookieDuration} days
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
