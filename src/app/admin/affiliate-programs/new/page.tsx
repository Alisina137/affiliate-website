// src/app/admin/affiliate-programs/new/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

export default function NewAffiliateProgramPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingSlugs, setExistingSlugs] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
    logo: "",
    isActive: true,
  })

  // Fetch existing slugs on load
  useEffect(() => {
    const fetchExistingSlugs = async () => {
      try {
        const response = await fetch("/api/admin/affiliate-programs?limit=1000")
        const data = await response.json()
        const slugs = data.data?.map((p: any) => p.slug) || []
        setExistingSlugs(slugs)
      } catch (error) {
        console.error("Error fetching existing slugs:", error)
      }
    }
    fetchExistingSlugs()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: slug,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!formData.name || !formData.slug) {
      setError("Name and slug are required")
      setLoading(false)
      return
    }

    // Check if slug already exists
    if (existingSlugs.includes(formData.slug)) {
      setError(`Slug "${formData.slug}" already exists. Please use a different slug.`)
      setLoading(false)
      return
    }

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description ? formData.description.trim() : null,
        website: formData.website ? formData.website.trim() : null,
        logo: formData.logo ? formData.logo.trim() : null,
        isActive: formData.isActive,
      }

      console.log("Sending payload:", payload)

      const response = await fetch("/api/admin/affiliate-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create affiliate program")
      }

      router.push("/admin/affiliate-programs")
      router.refresh()
    } catch (error) {
      console.error("Submit error:", error)
      setError(error instanceof Error ? error.message : "Failed to create affiliate program")
    } finally {
      setLoading(false)
    }
  }

  const isSlugValid = (slug: string) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/affiliate-programs" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Affiliate Program</h1>
          <p className="text-gray-500">Add a new affiliate program</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Amazon Associates"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="amazon-associates"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.slug && !isSlugValid(formData.slug) ? "border-red-500" : ""
                }`}
              />
              {formData.slug && !isSlugValid(formData.slug) && (
                <p className="text-xs text-red-500 mt-1">
                  Slug must be lowercase with hyphens only
                </p>
              )}
              {formData.slug && isSlugValid(formData.slug) && existingSlugs.includes(formData.slug) && (
                <p className="text-xs text-red-500 mt-1">
                  This slug already exists. Please use a different one.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Program description..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://affiliate.amazon.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || !formData.slug || (formData.slug && !isSlugValid(formData.slug)) || existingSlugs.includes(formData.slug)}
              className="flex items-center gap-2 px-6 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? "Saving..." : "Create Program"}
            </button>
            <Link href="/admin/affiliate-programs" className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
