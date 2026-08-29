// src/components/admin/categories/CategoryForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Loader2 } from "lucide-react"

interface Niche {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
  nicheId: string
  niche?: {
    name: string
  }
  children?: Category[]
}

interface CategoryFormProps {
  niches: Niche[]
  categories: Category[]
  initialData?: {
    id: string
    name: string
    slug: string
    description?: string | null
    image?: string | null
    nicheId: string
    parentId?: string | null
    order: number
    isActive: boolean
  }
}

export function CategoryForm({ niches, categories, initialData }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNiche, setSelectedNiche] = useState(initialData?.nicheId || "")

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    nicheId: initialData?.nicheId || "",
    parentId: initialData?.parentId || "",
    order: initialData?.order || 0,
    isActive: initialData?.isActive ?? true,
  })

  useEffect(() => {
    setFormData(prev => ({ ...prev, nicheId: selectedNiche, parentId: "" }))
  }, [selectedNiche])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (name === "nicheId") {
      setSelectedNiche(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = initialData
        ? `/api/admin/categories/${initialData.id}`
        : "/api/admin/categories"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save category")
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Filter parent categories by selected niche
  const filteredCategories = categories.filter(
    (cat) => cat.nicheId === selectedNiche && cat.id !== initialData?.id
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Niche */}
        <div>
          <label htmlFor="nicheId" className="block text-sm font-medium text-gray-700 mb-1">
            Niche *
          </label>
          <select
            id="nicheId"
            name="nicheId"
            value={formData.nicheId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a niche</option>
            {niches.map((niche) => (
              <option key={niche.id} value={niche.id}>
                {niche.name}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Category */}
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            id="parentId"
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None (Root category)</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
                {cat.children && cat.children.length > 0 && ` (${cat.children.length} subcategories)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
          Order
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          min="0"
          className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Active
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {initialData ? "Update Category" : "Create Category"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}
