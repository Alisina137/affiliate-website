// src/app/admin/categories/[id]/edit/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  nicheId: string | null
  parentId: string | null
  order: number | null
  isActive: boolean
}

interface Niche {
  id: string
  name: string
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [niches, setNiches] = useState<Niche[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [existingSlugs, setExistingSlugs] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    nicheId: "",
    parentId: "",
    order: "",
    isActive: true,
  })

  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

  // Fetch category data and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category
        const categoryRes = await fetch(`/api/admin/categories/${id}`)
        const categoryData = await categoryRes.json()

        if (categoryData.data) {
          const category = categoryData.data
          setFormData({
            name: category.name || "",
            slug: category.slug || "",
            description: category.description || "",
            image: category.image || "",
            nicheId: category.nicheId || "",
            parentId: category.parentId || "",
            order: category.order?.toString() || "",
            isActive: category.isActive !== false,
          })
        } else {
          setError("Category not found")
        }

        // Fetch niches
        const nichesRes = await fetch("/api/admin/niches?limit=100")
        const nichesData = await nichesRes.json()
        setNiches(nichesData.data || [])

        // Fetch parent categories
        const categoriesRes = await fetch("/api/admin/categories?limit=100")
        const categoriesData = await categoriesRes.json()
        setParentCategories(
          categoriesData.data?.filter((c: Category) => !c.parentId && c.id !== id) || []
        )

        // Fetch existing slugs (excluding current)
        const allCategoriesRes = await fetch("/api/admin/categories?limit=1000")
        const allCategoriesData = await allCategoriesRes.json()
        setExistingSlugs(
          allCategoriesData.data
            ?.filter((c: Category) => c.id !== id)
            .map((c: Category) => c.slug) || []
        )
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load category data")
      } finally {
        setFetching(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

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

  const isSlugValid = (slug: string) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check if slug is valid
    if (!isSlugValid(formData.slug)) {
      setError("Slug must be lowercase with hyphens only (e.g., &quot;laptops&quot; or &quot;gaming-laptops&quot;)")
      setLoading(false)
      return
    }

    // Check if slug already exists (excluding current category)
    if (existingSlugs.includes(formData.slug)) {
      setError(`Slug "${formData.slug}" already exists. Please use a different slug.`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: formData.order ? parseInt(formData.order) : 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update category")
      }

      // Redirect to categories list
      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update category")
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Category</h1>
          <p className="text-gray-500">Update category information</p>
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
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Laptops"
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
                placeholder="laptops"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.slug && !isSlugValid(formData.slug) ? "border-red-500" : ""
                }`}
              />
              {formData.slug && !isSlugValid(formData.slug) && (
                <p className="text-xs text-red-500 mt-1">
                  Slug must be lowercase with hyphens only (e.g., &quot;laptops&quot; or &quot;gaming-laptops&quot;)
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
              placeholder="Category description..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niche *
              </label>
              <select
                name="nicheId"
                value={formData.nicheId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select niche</option>
                {niches.map((niche) => (
                  <option key={niche.id} value={niche.id}>
                    {niche.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None (Root category)</option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/category-image.jpg"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
              className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
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
              disabled={loading || !formData.slug || !isSlugValid(formData.slug) || existingSlugs.includes(formData.slug)}
              className="flex items-center gap-2 px-6 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? "Saving..." : "Update Category"}
            </button>
            <Link href="/admin/categories" className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
