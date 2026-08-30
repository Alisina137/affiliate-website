// src/app/affiliate-links/page.tsx
import Link from "next/link"
import { db } from "@/lib/db"
import { ExternalLink, Building2 } from "lucide-react"

export const metadata = {
  title: "Affiliate Links",
  description: "Browse all affiliate links",
}

export default async function AffiliateLinksPage() {
  const links = await db.affiliateLink.findMany({
    where: { isActive: true },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Affiliate Links</h1>
        <p className="text-gray-600 mb-8">Browse all affiliate links</p>

        {links.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No affiliate links available</h3>
            <p className="text-gray-500 mt-1">Check back later for new affiliate links.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((link) => (
              <Link
                key={link.id}
                href={`/affiliate-links/${link.id}`}
                className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{link.merchant}</h3>
                    {link.product && (
                      <p className="text-sm text-gray-500">{link.product.name}</p>
                    )}
                    <p className="text-sm text-gray-400">{link.label}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {link.country}
                  </span>
                  {link.clicks > 0 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {link.clicks} clicks
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
