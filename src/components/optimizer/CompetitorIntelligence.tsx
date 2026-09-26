"use client"

import { useState } from "react"

type Intelligence = {
  source: string
  observedAt: string
  competitors: Array<{ finalUrl: string; title: string; signals: { wordCount: number; headings: string[]; hasTable: boolean; hasFaqLanguage: boolean; hasProsCons: boolean; hasBuyingGuide: boolean; hasComparisonLanguage: boolean } }>
  gaps: Array<{ type: string; label: string; evidence: string }>
  notes: string[]
}

export function CompetitorIntelligence({ articleId }: { articleId: string }) {
  const [urls, setUrls] = useState("")
  const [data, setData] = useState<Intelligence | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function analyze() {
    const list = urls.split(/\r?\n/).map((url) => url.trim()).filter(Boolean)
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/optimizer/articles/${articleId}/competitors`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urls: list }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) { setError(payload.error || "Could not analyze competitors."); return }
      setData(payload.intelligence)
    } catch { setError("Could not reach the server.") } finally { setBusy(false) }
  }

  return <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-indigo-600">External intelligence · manual URLs</p>
      <h2 className="mt-1 text-2xl font-bold text-[#1a1a2e]">Competitor content gaps</h2>
      <p className="mt-2 text-sm text-gray-600">Paste up to 5 public competitor article URLs, one per line. This compares observable page content only; it does not claim these pages rank for your keyword.</p>
      <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={5} placeholder={"https://example.com/article-one\nhttps://example.com/article-two"} className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      <button onClick={analyze} disabled={busy || !urls.trim()} className="mt-3 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Analyzing…" : "Analyze competitors"}</button>
      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
    </div>

    {data && <div className="mt-8 space-y-7">
      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-950"><strong>Data boundary:</strong> {data.notes.join(" ")}</div>
      <div>
        <h3 className="font-semibold text-[#1a1a2e]">Observed competitor pages</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {data.competitors.map((item) => <div key={item.finalUrl} className="rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="mt-1 break-all text-xs text-gray-500">{item.finalUrl}</p>
            <p className="mt-3 text-sm text-gray-600">{item.signals.wordCount.toLocaleString()} readable words · {item.signals.headings.length} H2/H3 headings detected</p>
          </div>)}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between"><h3 className="font-semibold text-[#1a1a2e]">Evidence-backed gaps</h3><span className="text-xs text-gray-500">{data.gaps.length} observations</span></div>
        <div className="mt-3 space-y-3">
          {data.gaps.length === 0 ? <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">No strong shared gaps were detected from these supplied pages.</p> : data.gaps.map((gap, index) => <div key={`${gap.type}-${gap.label}-${index}`} className="rounded-lg border border-gray-200 p-4"><div className="flex gap-2"><span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">{gap.type}</span><strong className="text-sm">{gap.label}</strong></div><p className="mt-2 text-sm text-gray-600">{gap.evidence}</p></div>)}
        </div>
      </div>
    </div>}
  </section>
}
