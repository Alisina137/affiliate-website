// src/components/admin/brands/BrandForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Loader2 } from "lucide-react"

interface Niche {
  id: string
  name: string
  slug: string
}

interface BrandFormProps {
  niches: Niche[]
  initialData?: {
    id: string
    name: string
    slug: string
    description?: string | null
    logo?: string | null
    website?: string | null
    foundedYear?: number | null
    headquarters?: string | null
    nicheId?: string | null
    isActive: boolean
  }
}

export function BrandForm({ niches, initialData }: BrandFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    logo: initialData?.logo || "",
    website: initialData?.website || "",
    foundedYear: initialData?.foundedYear || "",
    headquarters: initialData?.headquarters || "",
    nicheId: initialData?.nicheId || "",
    isActive: initialData?.isActive ?? true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = initialData
        ? `/api/admin/brands/${initialData.id}`
        : "/api/admin/brands"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save brand")
      }

      router.push("/admin/brands")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

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
          <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (e.g., "apple")</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo URL */}
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            type="url"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Founded Year */}
        <div>
          <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-1">
            Founded Year
          </label>
          <input
            type="number"
            id="foundedYear"
            name="foundedYear"
            value={formData.foundedYear}
            onChange={handleChange}
            min="1800"
            max={new Date().getFullYear()}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Headquarters */}
        <div>
          <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 mb-1">
            Headquarters
          </label>
          <input
            type="text"
            id="headquarters"
            name="headquarters"
            value={formData.headquarters}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Niche */}
      <div>
        <label htmlFor="nicheId" className="block text-sm font-medium text-gray-700 mb-1">
          Niche
        </label>
        <select
          id="nicheId"
          name="nicheId"
          value={formData.nicheId}
          onChange={handleChange}
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
              {initialData ? "Update Brand" : "Create Brand"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/brands")}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}
