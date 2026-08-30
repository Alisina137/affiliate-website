// src/app/admin/guides/[id]/page.tsx
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditGuidePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", introduction: "", content: "",
    status: "DRAFT", featured: false,
  })

  useEffect(() => {
    fetch(`/api/admin/guides/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) setFormData({
          title: data.data.title || "", slug: data.data.slug || "",
          excerpt: data.data.excerpt || "", introduction: data.data.introduction || "",
          content: data.data.content || "", status: data.data.status || "DRAFT",
          featured: data.data.featured || false,
        })
      })
      .catch(() => setError("Failed to load"))
  }, [params.id])

  const handleChange = (e: any) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/guides/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to update")
      router.push("/admin/guides")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update")
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return
    setLoading(true)
    try {
      await fetch(`/api/admin/guides/${params.id}`, { method: "DELETE" })
      router.push("/admin/guides")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete")
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Guide</h1>
        <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <input type="text" name="excerpt" value={formData.excerpt} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
            <textarea name="introduction" value={formData.introduction} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={8} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option>
              </select></div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />
              <label className="text-sm text-gray-700">Featured</label>
            </div>
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44]">{loading ? "Saving..." : "Update Guide"}</button>
            <a href="/admin/guides" className="px-6 py-2 text-gray-600 hover:text-gray-800">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  )
}
