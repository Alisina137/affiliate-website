"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ArticleFormValue = {
  id: string
  projectId: string
  title: string
  sourceUrl: string | null
  content: string | null
  targetQuery: string | null
  secondaryKeywords: string[]
  country: string
  language: string
}

export function EditArticleForm({ article }: { article: ArticleFormValue }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")

    const form = new FormData(event.currentTarget)
    const secondaryKeywords = String(form.get("secondaryKeywords") || "")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)

    try {
      const response = await fetch(`/api/optimizer/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          sourceUrl: form.get("sourceUrl"),
          content: form.get("content"),
          targetQuery: form.get("targetQuery"),
          secondaryKeywords,
          country: form.get("country"),
          language: form.get("language"),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || "Could not save article.")
        return
      }
      router.refresh()
    } catch {
      setError("Could not reach the server. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm("Delete this article and all of its optimizer analyses?")) return
    setDeleting(true)
    setError("")
    try {
      const response = await fetch(`/api/optimizer/articles/${article.id}`, { method: "DELETE" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || "Could not delete article.")
        return
      }
      router.push(`/dashboard/optimizer/projects/${article.projectId}`)
      router.refresh()
    } catch {
      setError("Could not reach the server. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Article title</span>
        <input name="title" required defaultValue={article.title} maxLength={200} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Target keyword</span>
        <input name="targetQuery" required defaultValue={article.targetQuery || ""} maxLength={200} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Source URL</span>
        <input name="sourceUrl" type="url" defaultValue={article.sourceUrl || ""} maxLength={2048} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Article content</span>
        <textarea name="content" rows={14} defaultValue={article.content || ""} maxLength={150000} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Secondary keywords</span>
        <input name="secondaryKeywords" defaultValue={article.secondaryKeywords.join(", ")} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Country</span>
          <input name="country" defaultValue={article.country} maxLength={80} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Language</span>
          <input name="language" defaultValue={article.language} maxLength={80} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button disabled={busy || deleting} className="rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Saving..." : "Save changes"}
        </button>
        <button type="button" onClick={remove} disabled={busy || deleting} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50">
          {deleting ? "Deleting..." : "Delete article"}
        </button>
      </div>
    </form>
  )
}
