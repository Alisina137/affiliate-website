// src/components/admin/ai/AIContentStudio.tsx
"use client"

import { useState } from "react"
import {
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Star,
  GitCompare,
  BookOpen,
  BarChart,
  Package,
  Tag,
  Building2,
  ListChecks,
  Globe,
  Plus,
  X,
} from "lucide-react"

type ContentType =
  | "REVIEW"
  | "COMPARISON"
  | "BEST_OF"
  | "GUIDE"
  | "STATISTICS"
  | "PRODUCT"
  | "CATEGORY"
  | "BRAND"
  | "FAQ"
  | "SEO"
  | "OUTLINE"

interface ContentTypeOption {
  value: ContentType
  label: string
  icon: React.ReactNode
  description: string
}

const contentTypes: ContentTypeOption[] = [
  { value: "REVIEW", label: "Review", icon: <Star className="h-4 w-4" />, description: "In-depth product review" },
  { value: "COMPARISON", label: "Comparison", icon: <GitCompare className="h-4 w-4" />, description: "Side-by-side product comparison" },
  { value: "BEST_OF", label: "Best Of", icon: <ListChecks className="h-4 w-4" />, description: "Curated product list" },
  { value: "GUIDE", label: "Guide", icon: <BookOpen className="h-4 w-4" />, description: "Educational buying guide" },
  { value: "STATISTICS", label: "Statistics", icon: <BarChart className="h-4 w-4" />, description: "Data and research" },
  { value: "PRODUCT", label: "Product", icon: <Package className="h-4 w-4" />, description: "Product description" },
  { value: "CATEGORY", label: "Category", icon: <Tag className="h-4 w-4" />, description: "Category description" },
  { value: "BRAND", label: "Brand", icon: <Building2 className="h-4 w-4" />, description: "Brand profile" },
  { value: "FAQ", label: "FAQ", icon: <Globe className="h-4 w-4" />, description: "Frequently asked questions" },
  { value: "SEO", label: "SEO", icon: <FileText className="h-4 w-4" />, description: "SEO metadata" },
  { value: "OUTLINE", label: "Outline", icon: <ListChecks className="h-4 w-4" />, description: "Content outline" },
]

interface GenerationState {
  contentType: ContentType | ""
  topic: string
  category: string
  products: string[]
  audience: string
  keywords: string
  instructions: string
  tone: string
  depth: string
}

interface FAQItem {
  question: string
  answer: string
}

interface GeneratedContent {
  title?: string
  seoTitle?: string
  metaDescription?: string
  excerpt?: string
  introduction?: string
  bestFor?: string
  pros?: string[]
  cons?: string[]
  content?: string
  verdict?: string
  faq?: FAQItem[]
  cta?: string
}

export function AIContentStudio() {
  const [formData, setFormData] = useState<GenerationState>({
    contentType: "",
    topic: "",
    category: "",
    products: [],
    audience: "",
    keywords: "",
    instructions: "",
    tone: "Expert",
    depth: "Deep",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState<string[]>([])
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [productInput, setProductInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addProduct = () => {
    if (productInput.trim() && !formData.products.includes(productInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, productInput.trim()],
      }))
      setProductInput("")
    }
  }

  const removeProduct = (product: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p !== product),
    }))
  }

  const handleGenerate = async () => {
    if (!formData.contentType || !formData.topic) {
      setError("Please select a content type and enter a topic")
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress([])
    setGeneratedContent(null)

    const steps = [
      "Content brief",
      "Outline",
      "Title & SEO",
      "Introduction",
      "Main content",
      "Pros & Cons",
      "FAQ",
      "CTA",
    ]

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: formData.contentType,
          topic: formData.topic,
          category: formData.category,
          products: formData.products,
          audience: formData.audience,
          keywords: formData.keywords,
          instructions: formData.instructions,
          tone: formData.tone,
          depth: formData.depth,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      for (let i = 0; i < steps.length; i++) {
        setProgress((prev) => [...prev, steps[i]])
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setGeneratedContent(data.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate content")
    } finally {
      setIsGenerating(false)
    }
  }

  // Save as Draft function
  const handleSaveDraft = async () => {
    if (!generatedContent) {
      setError("No content to save. Please generate content first.")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: formData.contentType,
          content: generatedContent,
          topic: formData.topic,
          category: formData.category,
          products: formData.products,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft")
      }

      alert(`✅ Draft saved successfully! (ID: ${data.data?.id || "created"})`)
    } catch (error) {
      console.error("Save draft error:", error)
      setError(error instanceof Error ? error.message : "Failed to save draft")
    } finally {
      setIsSaving(false)
    }
  }

  // Preview function - Using data URL approach
  const handlePreview = () => {
    if (!generatedContent) {
      setError("No content to preview. Please generate content first.")
      return
    }

    // Build the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${generatedContent.title || "Content Preview"}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1a1a2e; }
            h1 { font-size: 2rem; margin-bottom: 0.5rem; }
            .meta { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
            .pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
            .pros { background: #e8f5e9; padding: 1rem; border-radius: 8px; }
            .cons { background: #fce4ec; padding: 1rem; border-radius: 8px; }
            .faq-item { border-bottom: 1px solid #eee; padding: 1rem 0; }
            .faq-item h4 { margin: 0; }
            .cta { background: #1a1a2e; color: white; padding: 1rem 2rem; border-radius: 8px; display: inline-block; margin-top: 1.5rem; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1>${generatedContent.title || "Untitled"}</h1>
          ${generatedContent.metaDescription ? `<p class="meta">${generatedContent.metaDescription}</p>` : ""}
          ${generatedContent.introduction ? `<p>${generatedContent.introduction}</p>` : ""}
          ${generatedContent.bestFor ? `<p><strong>Best For:</strong> ${generatedContent.bestFor}</p>` : ""}
          ${generatedContent.pros || generatedContent.cons ? `
            <div class="pros-cons">
              ${generatedContent.pros ? `<div class="pros"><h3>Pros</h3><ul>${generatedContent.pros.map((p: string) => `<li>${p}</li>`).join("")}</ul></div>` : ""}
              ${generatedContent.cons ? `<div class="cons"><h3>Cons</h3><ul>${generatedContent.cons.map((c: string) => `<li>${c}</li>`).join("")}</ul></div>` : ""}
            </div>
          ` : ""}
          ${generatedContent.content ? `<div>${generatedContent.content}</div>` : ""}
          ${generatedContent.verdict ? `<h2>Verdict</h2><p>${generatedContent.verdict}</p>` : ""}
          ${generatedContent.faq ? `
            <h2>FAQ</h2>
            ${generatedContent.faq.map((item: FAQItem) => `
              <div class="faq-item">
                <h4>Q: ${item.question}</h4>
                <p>A: ${item.answer}</p>
              </div>
            `).join("")}
          ` : ""}
          ${generatedContent.cta ? `<a href="#" class="cta">${generatedContent.cta}</a>` : ""}
        </body>
      </html>
    `

    // Encode and open in new tab
    const encodedHtml = encodeURIComponent(htmlContent)
    const dataUrl = `data:text/html;charset=utf-8,${encodedHtml}`
    window.open(dataUrl, "_blank")
  }

  // Regenerate function
  const handleRegenerate = async () => {
    if (!formData.contentType || !formData.topic) {
      setError("Please select a content type and enter a topic")
      return
    }

    setIsRegenerating(true)
    setError(null)
    setProgress([])
    setGeneratedContent(null)

    const steps = [
      "Content brief",
      "Outline",
      "Title & SEO",
      "Introduction",
      "Main content",
      "Pros & Cons",
      "FAQ",
      "CTA",
    ]

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: formData.contentType,
          topic: formData.topic,
          category: formData.category,
          products: formData.products,
          audience: formData.audience,
          keywords: formData.keywords.split(",").map((k: string) => k.trim()).filter(Boolean),
          instructions: formData.instructions,
          tone: formData.tone,
          depth: formData.depth,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to regenerate content")
      }

      for (let i = 0; i < steps.length; i++) {
        setProgress((prev) => [...prev, steps[i]])
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setGeneratedContent(data.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to regenerate content")
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">1. Choose Content Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFormData((prev) => ({ ...prev, contentType: type.value }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                formData.contentType === type.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">2. Enter Content Details</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Topic *
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Best Gaming Laptops"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="Gaming Laptops">Gaming Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Headphones">Headphones</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Products (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Add a product..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addProduct()
                  }
                }}
              />
              <button
                type="button"
                onClick={addProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.products.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.products.map((product) => (
                  <span
                    key={product}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                  >
                    {product}
                    <button
                      type="button"
                      onClick={() => removeProduct(product)}
                      className="hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              placeholder="e.g., Gamers, Professionals, Beginners"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="e.g., best gaming laptops, gaming computer, laptop for gamers"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              placeholder="Focus on performance, cooling, display quality, and value..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Expert">Expert</option>
                <option value="Helpful">Helpful</option>
                <option value="Conversational">Conversational</option>
                <option value="Professional">Professional</option>
                <option value="Enthusiastic">Enthusiastic</option>
              </select>
            </div>
            <div>
              <label htmlFor="depth" className="block text-sm font-medium text-gray-700 mb-1">
                Content Depth
              </label>
              <select
                id="depth"
                name="depth"
                value={formData.depth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Quick">Quick</option>
                <option value="Standard">Standard</option>
                <option value="Deep">Deep</option>
                <option value="Comprehensive">Comprehensive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                AI Generate
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mt-4">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      {isGenerating && progress.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-3">Generating...</h3>
          <div className="space-y-2">
            {progress.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-4">3. Generated Content</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">{generatedContent.title || "N/A"}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">{generatedContent.seoTitle || "N/A"}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">{generatedContent.metaDescription || "N/A"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{generatedContent.introduction || "N/A"}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pros</label>
                <ul className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                  {generatedContent.pros && generatedContent.pros.length > 0 ? (
                    generatedContent.pros.map((pro: string, i: number) => (
                      <li key={i}>✓ {pro}</li>
                    ))
                  ) : (
                    <li className="text-gray-400">No pros listed</li>
                  )}
                </ul>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cons</label>
                <ul className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                  {generatedContent.cons && generatedContent.cons.length > 0 ? (
                    generatedContent.cons.map((con: string, i: number) => (
                      <li key={i}>✗ {con}</li>
                    ))
                  ) : (
                    <li className="text-gray-400">No cons listed</li>
                  )}
                </ul>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FAQ</label>
              <div className="space-y-2">
                {generatedContent.faq && generatedContent.faq.length > 0 ? (
                  generatedContent.faq.map((item: FAQItem, i: number) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium">Q: {item.question}</p>
                      <p className="text-gray-600 mt-1">A: {item.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-400">No FAQ items</div>
                )}
              </div>
            </div>
            <div className="pt-4 border-t flex gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save as Draft"}
              </button>
              <button
                onClick={handlePreview}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Preview
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
