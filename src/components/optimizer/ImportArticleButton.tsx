"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ImportArticleButton({ articleId, disabled }: { articleId: string; disabled: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  async function importArticle() {
    setBusy(true)
    setMessage("")
    try {
      const response = await fetch(`/api/optimizer/articles/${articleId}/import`, { method: "POST" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessage([data.error, data.fallback].filter(Boolean).join(" "))
        return
      }
      setMessage("Article content imported successfully.")
      router.refresh()
    } catch {
      setMessage("Could not reach the server. You can paste the article content manually.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#1a1a2e]">Import from source URL</p>
          <p className="mt-1 text-xs text-gray-600">Fetch the public HTML page and extract readable article content. Some sites may block automated imports.</p>
        </div>
        <button type="button" onClick={importArticle} disabled={disabled || busy} className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Importing..." : "Import article"}
        </button>
      </div>
      {disabled && <p className="mt-2 text-xs text-amber-700">Add and save a source URL before importing.</p>}
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
