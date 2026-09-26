"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateArticleForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")

    const form = new FormData(event.currentTarget)
    const secondaryKeywords = String(form.get("secondaryKeywords") || "")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)

    try {
      const response = await fetch("/api/optimizer/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
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
        setError(data.error || "Could not create article.")
        return
      }

      router.push(`/dashboard/optimizer/projects/${projectId}/articles/${data.article.id}`)
      router.refresh()
    } catch {
      setError("Could not reach the server. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Article title</span>
        <input
          name="title"
          required
          maxLength={200}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Best Walking Pads for Small Apartments"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Target keyword</span>
        <input
          name="targetQuery"
          required
          maxLength={200}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="best walking pad for small apartment"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Source URL</span>
        <input
          name="sourceUrl"
          type="url"
          maxLength={2048}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="https://example.com/article"
        />
        <span className="mt-1 block text-xs text-gray-500">
          After saving, you can securely import content from this public URL. If the site blocks extraction, paste the article content manually.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Article content</span>
        <textarea
          name="content"
          rows={14}
          maxLength={150000}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
          placeholder="Paste the current article content here..."
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Secondary keywords</span>
        <input
          name="secondaryKeywords"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="walking pad review, compact treadmill, under desk treadmill"
        />
        <span className="mt-1 block text-xs text-gray-500">Separate keywords with commas.</span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Country</span>
          <input
            name="country"
            defaultValue="US"
            maxLength={80}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Language</span>
          <input
            name="language"
            defaultValue="en"
            maxLength={80}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={busy}
        className="rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Saving..." : "Save article"}
      </button>
    </form>
  )
}
