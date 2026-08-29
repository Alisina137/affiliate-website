// src/components/admin/affiliate-programs/ProgramForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Loader2, Plus, Trash2, Edit } from "lucide-react"

interface Merchant {
  id?: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
}

interface ProgramFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    description?: string | null
    logo?: string | null
    website?: string | null
    commission?: string | null
    cookieDuration?: number | null
    isActive: boolean
    merchants: Merchant[]
  }
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<Merchant[]>(initialData?.merchants || [])
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    logo: initialData?.logo || "",
    website: initialData?.website || "",
    commission: initialData?.commission || "",
    cookieDuration: initialData?.cookieDuration?.toString() || "",
    isActive: initialData?.isActive ?? true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleMerchantChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (editingMerchant) {
      setEditingMerchant({ ...editingMerchant, [name]: value })
    }
  }

  const addMerchant = () => {
    if (!editingMerchant?.name) return
    const merchantToAdd = {
      ...editingMerchant,
      slug: editingMerchant.slug || editingMerchant.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }
    if (editingMerchant.id) {
      // Update existing
      setMerchants(merchants.map(m =>
        m.id === editingMerchant.id ? merchantToAdd : m
      ))
    } else {
      // Add new
      setMerchants([...merchants, merchantToAdd])
    }
    setEditingMerchant(null)
  }

  const removeMerchant = (id: string) => {
    setMerchants(merchants.filter(m => m.id !== id))
  }

  const startEditMerchant = (merchant: Merchant) => {
    setEditingMerchant({ ...merchant })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = initialData
        ? `/api/admin/affiliate-programs/${initialData.id}`
        : "/api/admin/affiliate-programs"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cookieDuration: formData.cookieDuration ? parseInt(formData.cookieDuration.toString()) : null,
          merchants: merchants.map(m => ({
            ...m,
            id: m.id || undefined,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save program")
      }

      router.push("/admin/affiliate-programs")
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Program Name *
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
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div>
          <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-1">
            Commission
          </label>
          <input
            type="text"
            id="commission"
            name="commission"
            value={formData.commission}
            onChange={handleChange}
            placeholder="e.g., 5%, $10 per sale"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cookieDuration" className="block text-sm font-medium text-gray-700 mb-1">
          Cookie Duration (days)
        </label>
        <input
          type="number"
          id="cookieDuration"
          name="cookieDuration"
          value={formData.cookieDuration}
          onChange={handleChange}
          min="0"
          className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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

      {/* Merchants Section */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Merchants</h3>

        {/* Merchant List */}
        {merchants.length > 0 && (
          <div className="space-y-2 mb-4">
            {merchants.map((merchant) => (
              <div key={merchant.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="font-medium">{merchant.name}</p>
                  {merchant.description && (
                    <p className="text-sm text-gray-500">{merchant.description}</p>
                  )}
                  {merchant.website && (
                    <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      {merchant.website}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditMerchant(merchant)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMerchant(merchant.id!)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Merchant Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-3">
            {editingMerchant?.id ? "Edit Merchant" : "Add Merchant"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              value={editingMerchant?.name || ""}
              onChange={handleMerchantChange}
              placeholder="Merchant name"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="slug"
              value={editingMerchant?.slug || ""}
              onChange={handleMerchantChange}
              placeholder="Slug"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              name="website"
              value={editingMerchant?.website || ""}
              onChange={handleMerchantChange}
              placeholder="Website URL"
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addMerchant}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {editingMerchant?.id ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setEditingMerchant(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
              {initialData ? "Update Program" : "Create Program"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/affiliate-programs")}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}
