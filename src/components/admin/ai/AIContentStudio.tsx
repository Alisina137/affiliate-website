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
  X
} from "lucide-react"
import { ContentEditor } from "./ContentEditor"
import { AIQualityControl } from "./AIQualityControl"

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
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [productInput, setProductInput] = useState("")

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
      // Simulate generation steps
      for (let i = 0; i < steps.length; i++) {
        setProgress((prev) => [...prev, steps[i]])
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Mock generated content
      const mockContent = {
        title: `Best ${formData.topic} in 2026`,
        seoTitle: `Best ${formData.topic} 2026 - Top Picks & Reviews`,
        metaDescription: `Discover the best ${formData.topic} with expert reviews and comparisons. Find the perfect product for your needs.`,
        excerpt: `Looking for the best ${formData.topic}? Our team has researched and compared the top options to help you make an informed decision.`,
        introduction: `Finding the right ${formData.topic} can be overwhelming with so many options available. In this guide, we'll break down the best choices for different needs and budgets.`,
        bestFor: "Everyone looking for quality",
        pros: ["Excellent quality", "Great value", "Durable build"],
        cons: ["Premium price", "Limited availability"],
        sections: [
          { heading: "What to Look For", content: `When shopping for the best ${formData.topic}, consider factors like quality, price, and features.` },
          { heading: "Top Picks", content: `We've selected the top ${formData.topic} products based on extensive research.` },
        ],
        faq: [
          { question: `What is the best ${formData.topic}?`, answer: `The best ${formData.topic} depends on your specific needs and budget.` },
          { question: `How much does a good ${formData.topic} cost?`, answer: "Prices typically range from $50 to $500 depending on features and quality." },
        ],
        cta: `Check out our top picks and find the perfect ${formData.topic} for you today!`,
        contentBlocks: [
          { type: "paragraph", content: `Welcome to our comprehensive guide on the best ${formData.topic} available in 2026.` },
          { type: "heading", content: "Why Trust Our Recommendations" },
          { type: "paragraph", content: "Our team of experts has spent countless hours researching and analyzing the market." },
        ],
      }

      setGeneratedContent(mockContent)
    } catch (error) {
      setError("Failed to generate content. Please try again.")
      console.error("Generation error:", error)
    } finally {
      setIsGenerating(false)
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
          {/* Topic */}
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

          {/* Category */}
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

          {/* Products */}
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

          {/* Audience */}
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

          {/* Keywords */}
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

          {/* Instructions */}
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

          {/* Tone & Depth */}
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

        {/* Generate Button */}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">3. Edit Generated Content</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save as Draft
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                Preview
              </button>
            </div>
          </div>
          <ContentEditor
            content={generatedContent}
            onContentChange={setGeneratedContent}
            contentType={formData.contentType as string}
          />
          <div className="mt-6">
            <AIQualityControl
              contentId="temp-id"
              contentType={formData.contentType as string}
              onPublish={() => {
                console.log("Content published!")
              }}
              onSave={() => {
                console.log("Content saved!")
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
