// src/components/admin/ai/ContentEditor.tsx
"use client"

import { useState } from "react"
import { FieldEditor } from "./FieldEditor"

interface ContentEditorProps {
  content: any
  onContentChange: (content: any) => void
  contentType: string
}

export function ContentEditor({ content, onContentChange }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState("content")

  const updateField = (field: string, value: any) => {
    onContentChange({
      ...content,
      [field]: value,
    })
  }

  // Mock AI handlers - these would call actual AI APIs
  const handleAIImprove = async (_field: string, value: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `[Improved] ${value}`
  }

  const handleAIRewrite = async (_field: string, value: string, style: string = "professional"): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `[${style} style] ${value}`
  }

  const handleAIExpand = async (_field: string, value: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `${value} (expanded with more detail)`
  }

  const handleAIShorten = async (_field: string, value: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return value.length > 20 ? `${value.substring(0, 20)}...` : value
  }

  const handleAISimplify = async (_field: string, value: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `[Simplified] ${value}`
  }

  const tabs = [
    { id: "content", label: "Content" },
    { id: "seo", label: "SEO" },
    { id: "faq", label: "FAQ" },
    { id: "meta", label: "Metadata" },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="space-y-4">
          <FieldEditor
            label="Title"
            value={content.title || ""}
            onChange={(val) => updateField("title", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            onAIExpand={handleAIExpand}
            onAIShorten={handleAIShorten}
            placeholder="Enter the title..."
          />

          <FieldEditor
            label="Introduction"
            value={content.introduction || ""}
            onChange={(val) => updateField("introduction", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            onAIExpand={handleAIExpand}
            onAIShorten={handleAIShorten}
            onAISimplify={handleAISimplify}
            rows={4}
            placeholder="Enter the introduction..."
          />

          <FieldEditor
            label="Best For"
            value={content.bestFor || ""}
            onChange={(val) => updateField("bestFor", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            placeholder="Who is this product best for?"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldEditor
              label="Pros"
              value={Array.isArray(content.pros) ? content.pros.join(", ") : content.pros || ""}
              onChange={(val) => updateField("pros", val.split(",").map((s: string) => s.trim()).filter(Boolean))}
              onAIImprove={handleAIImprove}
              onAIRewrite={handleAIRewrite}
              placeholder="e.g., Lightweight, Long battery life"
              isArray
            />
            <FieldEditor
              label="Cons"
              value={Array.isArray(content.cons) ? content.cons.join(", ") : content.cons || ""}
              onChange={(val) => updateField("cons", val.split(",").map((s: string) => s.trim()).filter(Boolean))}
              onAIImprove={handleAIImprove}
              onAIRewrite={handleAIRewrite}
              placeholder="e.g., Expensive, Limited ports"
              isArray
            />
          </div>

          <FieldEditor
            label="Content"
            value={content.content || ""}
            onChange={(val) => updateField("content", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            onAIExpand={handleAIExpand}
            onAIShorten={handleAIShorten}
            onAISimplify={handleAISimplify}
            rows={8}
            placeholder="Write the main content..."
          />

          <FieldEditor
            label="Verdict / Conclusion"
            value={content.verdict || ""}
            onChange={(val) => updateField("verdict", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            rows={3}
            placeholder="Final verdict..."
          />
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          <FieldEditor
            label="SEO Title"
            value={content.seoTitle || ""}
            onChange={(val) => updateField("seoTitle", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            placeholder="SEO title (max 60 characters)"
          />
          <FieldEditor
            label="Meta Description"
            value={content.metaDescription || ""}
            onChange={(val) => updateField("metaDescription", val)}
            onAIImprove={handleAIImprove}
            onAIRewrite={handleAIRewrite}
            rows={2}
            placeholder="Meta description (max 160 characters)"
          />
          <FieldEditor
            label="Slug"
            value={content.slug || ""}
            onChange={(val) => updateField("slug", val)}
            onAIImprove={handleAIImprove}
            placeholder="URL-friendly slug"
          />
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {content.faq && Array.isArray(content.faq) && content.faq.map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <FieldEditor
                label={`Question ${index + 1}`}
                value={item.question || ""}
                onChange={(val) => {
                  const newFaq = [...content.faq]
                  newFaq[index].question = val
                  updateField("faq", newFaq)
                }}
                placeholder="Enter question..."
              />
              <FieldEditor
                label={`Answer ${index + 1}`}
                value={item.answer || ""}
                onChange={(val) => {
                  const newFaq = [...content.faq]
                  newFaq[index].answer = val
                  updateField("faq", newFaq)
                }}
                rows={2}
                placeholder="Enter answer..."
              />
            </div>
          ))}
          <button
            onClick={() => {
              const newFaq = [...(content.faq || []), { question: "", answer: "" }]
              updateField("faq", newFaq)
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            + Add FAQ
          </button>
        </div>
      )}

      {/* Metadata Tab */}
      {activeTab === "meta" && (
        <div className="space-y-4">
          <FieldEditor
            label="Author"
            value={content.authorId || ""}
            onChange={(val) => updateField("authorId", val)}
            placeholder="Author ID"
          />
          <FieldEditor
            label="Category"
            value={content.categoryId || ""}
            onChange={(val) => updateField("categoryId", val)}
            placeholder="Category ID"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.featured || false}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Featured</label>
          </div>
        </div>
      )}
    </div>
  )
}
