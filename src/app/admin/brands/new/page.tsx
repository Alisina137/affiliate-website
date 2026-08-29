// src/app/admin/brands/new/page.tsx
import { BrandForm } from "@/components/admin/brands/BrandForm"

export const metadata = {
  title: "Create Brand",
  description: "Add a new brand to the system",
}

export default async function NewBrandPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Brand</h1>
          <p className="text-gray-500 mt-1">Add a new brand to the system</p>
        </div>

        <BrandForm />
      </div>
    </div>
  )
}
