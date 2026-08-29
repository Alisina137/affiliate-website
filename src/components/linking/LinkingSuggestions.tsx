// src/components/linking/LinkingSuggestions.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Link2, Plus, Check, ArrowRight, Sparkles } from "lucide-react"

interface Suggestion {
  id: string
  title: string
  slug: string
  type: string
  url: string
  relevance: number
  reason: string
}

interface LinkingSuggestionsProps {
  contentId: string
  contentType: string
  keywords?: string[]
}

export function LinkingSuggestions({ contentId, contentType, keywords = [] }: LinkingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/internal-links/suggestions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId,
            contentType,
            keywords,
          }),
        })
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [contentId, contentType, keywords])

  const toggleSuggestion = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleApplyLinks = async () => {
    try {
      const response = await fetch(`/api/internal-links/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          contentType,
          linkIds: selected,
        }),
      })

      if (response.ok) {
        setSelected([])
        alert("Links applied successfully!")
      }
    } catch (error) {
      console.error("Error applying links:", error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <Link2 className="h-5 w-5 text-blue-600 animate-pulse" />
          <span className="text-gray-600">Finding linking opportunities...</span>
        </div>
      </div>
    )
  }

  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Internal Linking Suggestions</h3>
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
            {suggestions.length}
          </span>
        </div>
        <span className="text-sm text-gray-500">{showSuggestions ? "Hide" : "Show"}</span>
      </button>

      {showSuggestions && (
        <div className="mt-4 space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <button
                onClick={() => toggleSuggestion(suggestion.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  selected.includes(suggestion.id)
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {selected.includes(suggestion.id) && <Check className="h-3 w-3 text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                <Link
                  href={suggestion.url}
                  target="_blank"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {suggestion.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{suggestion.type}</span>
                  <span className="text-xs text-gray-400">{suggestion.reason}</span>
                  <span className="text-xs text-gray-400">
                    Relevance: {Math.round(suggestion.relevance * 100)}%
                  </span>
                </div>
              </div>

              <Link
                href={suggestion.url}
                target="_blank"
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}

          {selected.length > 0 && (
            <button
              onClick={handleApplyLinks}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Apply {selected.length} Selected Link{selected.length > 1 ? "s" : ""}
            </button>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Tip: Adding relevant internal links improves SEO and user engagement.
          </p>
        </div>
      )}
    </div>
  )
}
