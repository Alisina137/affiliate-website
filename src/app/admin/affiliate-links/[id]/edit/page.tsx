// src/app/admin/affiliate-links/[id]/edit/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  brand: { id: string; name: string } | null
}

export default function EditAffiliateLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    productId: "",
    merchant: "",
    url: "",
    label: "Check Price",
    trackingUrl: "",
    country: "US",
    priority: 0,
    isActive: true,
  })

  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch affiliate link data
        const linkRes = await fetch(`/api/admin/affiliate-links/${id}`)
        
        if (!linkRes.ok) {
          if (linkRes.status === 404) {
            setError("Affiliate link not found")
          } else {
            throw new Error(`HTTP error! status: ${linkRes.status}`)
          }
          return
        }
        
        const linkData = await linkRes.json()
        const link = linkData.data
        
        if (link) {
          setFormData({
            productId: link.productId || "",
            merchant: link.merchant || "",
            url: link.url || "",
            label: link.label || "Check Price",
            trackingUrl: link.trackingUrl || "",
            country: link.country || "US",
            priority: link.priority || 0,
            isActive: link.isActive ?? true,
          })
        } else {
          setError("Affiliate link not found")
        }

        // Fetch products for dropdown
        const productsRes = await fetch("/api/admin/products?limit=100")
        const productsData = await productsRes.json()
        setProducts(productsData.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load affiliate link")
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.productId || !formData.merchant || !formData.url) {
      setError("Product, merchant, and URL are required")
      setLoading(false)
      return
    }

    try {
      const payload = {
        productId: formData.productId,
        merchant: formData.merchant.trim(),
        url: formData.url.trim(),
        label: formData.label.trim(),
        trackingUrl: formData.trackingUrl ? formData.trackingUrl.trim() : null,
        country: formData.country,
        priority: parseInt(formData.priority.toString()),
        isActive: formData.isActive,
      }

      console.log("Updating payload:", payload)

      const response = await fetch(`/api/admin/affiliate-links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to update affiliate link")
      }

      router.push("/admin/affiliate-links")
      router.refresh()
    } catch (error) {
      console.error("Update error:", error)
      setError(error instanceof Error ? error.message : "Failed to update affiliate link")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !formData.merchant) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Affiliate Link Not Found</h3>
          <p className="text-gray-500">{error}</p>
          <Link
            href="/admin/affiliate-links"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Affiliate Links
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/affiliate-links" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Affiliate Link</h1>
          <p className="text-gray-500">Update affiliate link details</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product *
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} {product.brand ? `(${product.brand.name})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant *
            </label>
            <input
              type="text"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              required
              placeholder="Amazon, Best Buy, etc."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Affiliate URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://www.amazon.com/dp/product-id?tag=your-tag"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Label
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Check Price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tracking URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking URL (Optional)
            </label>
            <input
              type="url"
              name="trackingUrl"
              value={formData.trackingUrl}
              onChange={handleChange}
              placeholder="https://tracking.example.com/click?link=123"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Higher numbers appear first</p>
            </div>
          </div>

          {/* Active */}
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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? "Saving..." : "Update Link"}
            </button>
            <Link href="/admin/affiliate-links" className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
