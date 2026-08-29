// src/app/admin/categories/new/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CategoryForm } from "@/components/admin/categories/CategoryForm"
import { db } from "@/lib/db"

export default async function NewCategoryPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Get niches and parent categories for dropdowns
  const [niches, categories] = await Promise.all([
    db.niche.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    db.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        niche: true,
        children: {
          where: { isActive: true },
        },
      },
      orderBy: [{ nicheId: "asc" }, { name: "asc" }],
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Category</h1>
        <p className="text-gray-500">Add a new category to organize products</p>
      </div>

      <div className="max-w-2xl">
        <CategoryForm niches={niches} categories={categories} />
      </div>
    </div>
  )
}
