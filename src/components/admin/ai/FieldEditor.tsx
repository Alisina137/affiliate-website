// src/components/admin/ai/FieldEditor.tsx
"use client"

import { useState } from "react"
import { 
  Loader2, 
  AlertCircle,
  Edit,
  RefreshCw,
  Wand2,
  Maximize2,
  Minimize2,
  MessageSquare,
  X
} from "lucide-react"

interface FieldEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  onAIImprove?: (field: string, value: string) => Promise<string>
  onAIRewrite?: (field: string, value: string, style?: string) => Promise<string>
  onAIExpand?: (field: string, value: string) => Promise<string>
  onAIShorten?: (field: string, value: string) => Promise<string>
  onAISimplify?: (field: string, value: string) => Promise<string>
  placeholder?: string
  rows?: number
  isArray?: boolean
  isJSON?: boolean
  aiActions?: Array<"improve" | "rewrite" | "expand" | "shorten" | "simplify">
}

export function FieldEditor({
  label,
  value,
  onChange,
  onAIImprove,
  onAIRewrite,
  onAIExpand,
  onAIShorten,
  onAISimplify,
  placeholder = "",
  rows = 3,
  isArray = false,
  isJSON = false,
  aiActions = ["improve", "rewrite", "expand", "shorten", "simplify"],
}: FieldEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRewriteOptions, setShowRewriteOptions] = useState(false)
  const [hasManualEdits, setHasManualEdits] = useState(false)
  const [originalValue] = useState(value)

  const displayValue = isArray && typeof value === "string"
    ? value 
    : isJSON && typeof value === "object"
    ? JSON.stringify(value, null, 2)
    : value

  const handleAIImprove = async () => {
    if (!onAIImprove) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await onAIImprove(label, value)
      onChange(result)
      setHasManualEdits(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIRewrite = async (style: string) => {
    if (!onAIRewrite) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await onAIRewrite(label, value, style)
      onChange(result)
      setHasManualEdits(true)
      setShowRewriteOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rewrite")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIExpand = async () => {
    if (!onAIExpand) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await onAIExpand(label, value)
      onChange(result)
      setHasManualEdits(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to expand")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIShorten = async () => {
    if (!onAIShorten) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await onAIShorten(label, value)
      onChange(result)
      setHasManualEdits(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAISimplify = async () => {
    if (!onAISimplify) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await onAISimplify(label, value)
      onChange(result)
      setHasManualEdits(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to simplify")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    if (newValue !== originalValue) {
      setHasManualEdits(true)
    }
  }

  const handleRegenerate = async () => {
    if (!onAIImprove) return
    if (hasManualEdits) {
      if (!confirm("This field contains manual changes. Regenerating will replace them. Continue?")) {
        return
      }
    }
    await handleAIImprove()
  }

  const handleRevert = () => {
    if (confirm("Revert to original AI-generated content?")) {
      onChange(originalValue)
      setHasManualEdits(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {hasManualEdits && (
            <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
              Edited
            </span>
          )}
        </label>
        <div className="flex items-center gap-1">
          {aiActions.includes("improve") && onAIImprove && (
            <button
              onClick={handleAIImprove}
              disabled={isLoading}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
              title="AI Improve"
            >
              <Wand2 className="h-4 w-4" />
            </button>
          )}
          {aiActions.includes("rewrite") && onAIRewrite && (
            <div className="relative">
              <button
                onClick={() => setShowRewriteOptions(!showRewriteOptions)}
                disabled={isLoading}
                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                title="AI Rewrite"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              {showRewriteOptions && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border p-2 z-10 min-w-[160px]">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleAIRewrite("professional")}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 rounded"
                    >
                      Professional
                    </button>
                    <button
                      onClick={() => handleAIRewrite("conversational")}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 rounded"
                    >
                      Conversational
                    </button>
                    <button
                      onClick={() => handleAIRewrite("persuasive")}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 rounded"
                    >
                      Persuasive
                    </button>
                    <button
                      onClick={() => handleAIRewrite("technical")}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 rounded"
                    >
                      Technical
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {aiActions.includes("expand") && onAIExpand && (
            <button
              onClick={handleAIExpand}
              disabled={isLoading}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
              title="AI Expand"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          {aiActions.includes("shorten") && onAIShorten && (
            <button
              onClick={handleAIShorten}
              disabled={isLoading}
              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-50"
              title="AI Shorten"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          )}
          {aiActions.includes("simplify") && onAISimplify && (
            <button
              onClick={handleAISimplify}
              disabled={isLoading}
              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded transition-colors disabled:opacity-50"
              title="AI Simplify"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
            title="Toggle Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          {hasManualEdits && (
            <>
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors disabled:opacity-50"
                title="Regenerate (will replace manual edits)"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={handleRevert}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Revert to original"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={typeof displayValue === "string" ? displayValue : ""}
          onChange={handleManualChange}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      ) : (
        <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
          {displayValue || <span className="text-gray-400">Empty</span>}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is working...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
