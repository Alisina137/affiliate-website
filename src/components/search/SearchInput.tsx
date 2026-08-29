// src/components/search/SearchInput.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

interface SearchInputProps {
  initialQuery?: string
}

export function SearchInput({ initialQuery = "" }: SearchInputProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2 && query.length < 4) {
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setSuggestions(data.suggestions || [])
        } catch {
          setSuggestions([])
        }
      } else {
        setSuggestions([])
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setSuggestions([])
  }

  const clearQuery = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <div className="relative" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="h-5 w-5 text-gray-400 ml-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for products, reviews, guides..."
            className="w-full px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && isFocused && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 border-b last:border-b-0"
            >
              <Search className="h-4 w-4 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
