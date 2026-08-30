// src/app/admin/comparisons/[id]/edit/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    productA: "",
    productB: "",
    excerpt: "",
    content: "",
    winner: "",
    winnerExplanation: "",
    status: "DRAFT",
    featured: false,
  })

  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

  useEffect(() => {
    if (!id) return
    
    Promise.all([
      fetch("/api/products?limit=100").then(res => res.json()),
      fetch(`/api/admin/comparisons/${id}`).then(res => res.json())
    ]).then(([productsData, comparisonData]) => {
      setProducts(productsData.data || [])
      if (comparisonData.data) {
        const d = comparisonData.data
        setFormData({
          title: d.title || "",
          slug: d.slug || "",
          productA: d.products?.[0]?.productId || "",
          productB: d.products?.[1]?.productId || "",
          excerpt: d.excerpt || "",
          content: d.content || "",
          winner: d.winner || "",
          winnerExplanation: d.winnerExplanation || "",
          status: d.status || "DRAFT",
          featured: d.featured || false,
        })
      }
    }).catch(() => setError("Failed to load comparison"))
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/comparisons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to update comparison")
      router.push("/admin/comparisons")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update comparison")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comparison?")) return
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/comparisons/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      router.push("/admin/comparisons")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Comparison</h1>
        <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">Delete</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product A *</label>
              <select name="productA" value={formData.productA} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product B *</label>
              <select name="productB" value={formData.productB} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <input type="text" name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={6} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
            <input type="text" name="winner" value={formData.winner} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Winner Explanation</label>
            <textarea name="winnerExplanation" value={formData.winnerExplanation} onChange={handleChange} rows={2} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />
              <label className="text-sm text-gray-700">Featured</label>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

          <div className="flex items-center gap-3 pt-4 border-t">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44]">{loading ? "Saving..." : "Update Comparison"}</button>
            <a href="/admin/comparisons" className="px-6 py-2 text-gray-600 hover:text-gray-800">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  )
}
