// src/app/admin/brands/new/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BrandForm } from "@/components/admin/brands/BrandForm"
import { db } from "@/lib/db"

export default async function NewBrandPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Get niches for dropdown
  const niches = await db.niche.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Brand</h1>
        <p className="text-gray-500">Add a new brand to the catalog</p>
      </div>

      <div className="max-w-2xl">
        <BrandForm niches={niches} />
      </div>
    </div>
  )
}
