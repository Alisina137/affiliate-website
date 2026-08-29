// src/app/admin/affiliate-links/new/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AffiliateLinkForm } from "@/components/admin/affiliate/AffiliateLinkForm"
import { db } from "@/lib/db"

export default async function NewAffiliateLinkPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Get products for dropdown
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Affiliate Link</h1>
        <p className="text-gray-500">Add a new affiliate link for a product</p>
      </div>

      <div className="max-w-2xl">
        <AffiliateLinkForm products={products} />
      </div>
    </div>
  )
}
