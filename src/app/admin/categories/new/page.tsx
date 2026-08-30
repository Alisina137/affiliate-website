// src/app/admin/categories/new/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [niches, setNiches] = useState<{ id: string; name: string }[]>([])
  const [parentCategories, setParentCategories] = useState<{ id: string; name: string }[]>([])
  const [existingSlugs, setExistingSlugs] = useState<string[]>([])
  const [showNewNicheModal, setShowNewNicheModal] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newNiche, setNewNiche] = useState({ name: "", slug: "", description: "" })
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    nicheId: "",
    parentId: "",
    order: "",
  })
  const isSubmitting = useRef(false)

  // Fetch niches, parent categories, and existing slugs
  useEffect(() => {
    fetchNiches()
    fetchParentCategories()
    fetchExistingSlugs()
  }, [])

  const fetchNiches = async () => {
    try {
      const response = await fetch("/api/admin/niches?limit=100")
      const data = await response.json()
      setNiches(data.data || [])
    } catch (error) {
      console.error("Error fetching niches:", error)
    }
  }

  const fetchParentCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?limit=100")
      const data = await response.json()
      setParentCategories(data.data?.filter((c: any) => !c.parentId) || [])
    } catch (error) {
      console.error("Error fetching parent categories:", error)
    }
  }

  const fetchExistingSlugs = async () => {
    try {
      const response = await fetch("/api/admin/categories?limit=1000")
      const data = await response.json()
      setExistingSlugs(data.data?.map((c: any) => c.slug) || [])
    } catch (error) {
      console.error("Error fetching existing slugs:", error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
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
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNewNicheChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setNewNiche((prev) => ({ ...prev, name: value, slug }))
    } else {
      setNewNiche((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setNewCategory((prev) => ({ ...prev, name: value, slug }))
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }))
    }
  }

  const createNewNiche = async () => {
    if (!newNiche.name || !newNiche.slug) {
      alert("Name and slug are required")
      return
    }

    try {
      const response = await fetch("/api/admin/niches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNiche),
      })

      if (response.ok) {
        const data = await response.json()
        setNiches([...niches, { id: data.data.id, name: data.data.name }])
        setFormData((prev) => ({ ...prev, nicheId: data.data.id }))
        setShowNewNicheModal(false)
        setNewNiche({ name: "", slug: "", description: "" })
        fetchNiches()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create niche")
      }
    } catch (error) {
      console.error("Error creating niche:", error)
      alert("Failed to create niche")
    }
  }

  const createNewParentCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      alert("Name and slug are required")
      return
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCategory,
          nicheId: formData.nicheId || null,
          parentId: null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh the parent categories list
        await fetchParentCategories()
        await fetchExistingSlugs()
        
        // Close the modal
        setShowNewCategoryModal(false)
        setNewCategory({ name: "", slug: "", description: "" })
        
        // Show success message
        alert(`Parent category "${data.data.name}" created successfully! You can now select it from the dropdown.`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create parent category")
      }
    } catch (error) {
      console.error("Error creating parent category:", error)
      alert("Failed to create parent category")
    }
  }

  const isSlugValid = (slug: string) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isSubmitting.current || loading) {
      console.log("Submission already in progress")
      return
    }
    
    isSubmitting.current = true
    setLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.nicheId) {
      setError("Please select a niche")
      isSubmitting.current = false
      setLoading(false)
      return
    }

    // Validate slug is unique
    if (existingSlugs.includes(formData.slug)) {
      setError(`Slug "${formData.slug}" already exists. Please use a different slug.`)
      isSubmitting.current = false
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: formData.order ? parseInt(formData.order) : 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error && data.error.includes("Unique constraint")) {
          setError(`Slug "${formData.slug}" already exists. Please use a different slug.`)
        } else {
          throw new Error(data.error || "Failed to create category")
        }
        isSubmitting.current = false
        setLoading(false)
        return
      }

      // Reset submission flag before redirect
      isSubmitting.current = false
      setLoading(false)
      
      // Redirect to categories list
      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create category")
      isSubmitting.current = false
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Category</h1>
          <p className="text-gray-500">Add a new category to the system</p>
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
                  Slug must be lowercase with hyphens only (e.g., "laptops" or "gaming-laptops")
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
              <div className="flex gap-2">
                <select
                  name="nicheId"
                  value={formData.nicheId}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select niche</option>
                  {niches.map((niche) => (
                    <option key={niche.id} value={niche.id}>
                      {niche.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewNicheModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  title="Create new niche"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <div className="flex gap-2">
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Root category)</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  title="Create new parent category"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
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

          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || isSubmitting.current || !formData.slug || !isSlugValid(formData.slug) || existingSlugs.includes(formData.slug) || !formData.nicheId}
              className="flex items-center gap-2 px-6 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? "Creating..." : "Create Category"}
            </button>
            <Link href="/admin/categories" className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* New Niche Modal */}
      {showNewNicheModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Niche</h2>
              <button
                onClick={() => setShowNewNicheModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newNiche.name}
                  onChange={handleNewNicheChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={newNiche.slug}
                  onChange={handleNewNicheChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newNiche.description}
                  onChange={handleNewNicheChange}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={createNewNiche}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Niche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Parent Category Modal */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Parent Category</h2>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                This will create a <strong>parent category</strong> (root category with no parent). 
                You can then select it from the dropdown above.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={newCategory.slug}
                  onChange={handleNewCategoryChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={createNewParentCategory}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Parent Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
