"use client"

import { useState } from "react"

type Optimization = {
  id: string
  operation: string
  status: string
  provider: string
  model: string
  originalContent: string
  suggestedContent: string
  rationale: string | null
  warnings: string[]
  createdAt: string | Date
}

export function OptimizationWorkspace({ articleId, initialContent, initialOptimizations }: { articleId: string; initialContent: string; initialOptimizations: Optimization[] }) {
  const [source, setSource] = useState(initialContent)
  const [operation, setOperation] = useState("REWRITE")
  const [instructions, setInstructions] = useState("")
  const [items, setItems] = useState(initialOptimizations)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function generate() {
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/optimizer/articles/${articleId}/optimize`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, originalContent: source, instructions: instructions || undefined }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) { setError(data.error || "Could not create suggestion."); return }
      setItems((current) => [data.optimization, ...current])
    } catch { setError("Could not reach the server.") } finally { setBusy(false) }
  }

  async function decide(id: string, decision: "ACCEPT" | "REJECT") {
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/optimizer/articles/${articleId}/optimize/${id}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) { setError(data.error || "Could not save decision."); return }
      setItems((current) => current.map((item) => item.id === id ? { ...item, status: data.optimization.status } : item))
      if (decision === "ACCEPT") {
        const accepted = items.find((item) => item.id === id)
        if (accepted) setSource(accepted.suggestedContent)
      }
    } catch { setError("Could not reach the server.") } finally { setBusy(false) }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Create optimization suggestion</h2>
        <p className="mt-1 text-sm text-gray-600">Suggestions never overwrite the article automatically. Review the result before accepting it.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Operation
            <select value={operation} onChange={(e) => setOperation(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="REWRITE">Rewrite</option><option value="EXPAND">Expand</option><option value="SIMPLIFY">Simplify</option>
              <option value="SEO">Improve SEO</option><option value="CTA">Improve CTA</option><option value="PERSUASION">Improve persuasion</option>
            </select>
          </label>
          <label className="text-sm font-medium">Optional instructions
            <input value={instructions} onChange={(e) => setInstructions(e.target.value)} maxLength={1000} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Keep the tone concise..." />
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium">Content to optimize
          <textarea value={source} onChange={(e) => setSource(e.target.value)} rows={12} maxLength={50000} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" />
        </label>
        <button onClick={generate} disabled={busy || !source.trim()} className="mt-4 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Working..." : "Generate suggestion"}</button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#1a1a2e]">Optimization history</h2>
        <div className="mt-4 space-y-6">
          {items.length === 0 ? <div className="rounded-xl border bg-white p-6 text-gray-600">No optimization suggestions yet.</div> : items.map((item) => (
            <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold">{item.operation}</span><span>{item.status}</span><span className="text-gray-400">{item.provider} · {item.model}</span></div>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div><h3 className="font-semibold">Original</h3><pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm">{item.originalContent}</pre></div>
                <div><h3 className="font-semibold">Suggested</h3><pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-emerald-50 p-4 text-sm">{item.suggestedContent}</pre></div>
              </div>
              {item.rationale && <p className="mt-4 text-sm text-gray-700"><strong>Why:</strong> {item.rationale}</p>}
              {item.warnings?.length > 0 && <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{item.warnings.map((warning) => <p key={warning}>⚠ {warning}</p>)}</div>}
              {item.status === "SUGGESTED" && <div className="mt-4 flex gap-3"><button disabled={busy} onClick={() => decide(item.id, "ACCEPT")} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Accept</button><button disabled={busy} onClick={() => decide(item.id, "REJECT")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold">Reject</button></div>}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
