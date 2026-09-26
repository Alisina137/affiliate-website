"use client"

import { useState } from "react"

export function AnalyzeArticleButton({ articleId, disabled }: { articleId: string; disabled: boolean }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function analyze() {
    setBusy(true)
    setError("")
    try {
      const response = await fetch(`/api/optimizer/articles/${articleId}/analyze`, { method: "POST" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || "Could not analyze this article.")
        return
      }
      window.location.href = window.location.pathname + "/analysis"
    } catch {
      setError("Could not reach the server. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <button type="button" onClick={analyze} disabled={disabled || busy} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? "Analyzing..." : "Analyze article"}
      </button>
      {disabled && <p className="mt-2 text-xs text-amber-700">Save or import article content and a target keyword before analyzing.</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
