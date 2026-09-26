import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"\nimport { CompetitorIntelligence } from "@/components/optimizer/CompetitorIntelligence"

export const dynamic = "force-dynamic"

const scoreLabels = [
  ["SEO", "seoScore"],
  ["Content Quality", "contentScore"],
  ["Search Intent", "intentScore"],
  ["Affiliate Optimization", "affiliateScore"],
  ["Conversion", "conversionScore"],
  ["Technical", "technicalScore"],
] as const

export default async function OptimizerAnalysisPage({ params }: { params: Promise<{ id: string; articleId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { id, articleId } = await params

  const article = await db.optimizerArticle.findFirst({
    where: { id: articleId, projectId: id, project: { userId: session.user.id } },
    select: { id: true, title: true, projectId: true },
  })
  if (!article) notFound()

  const analysis = await db.optimizerAnalysis.findFirst({
    where: { articleId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { issues: true },
  })

  if (!analysis) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href={`/dashboard/optimizer/projects/${id}/articles/${articleId}`} className="text-sm text-gray-500">← Back to article</Link>
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">No analysis yet</h1>
          <p className="mt-2 text-gray-600">Run an analysis from the article page first.</p>
        </div>
      </main>
    )
  }

  const severityRank: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const issues = [...analysis.issues].sort((a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9))

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href={`/dashboard/optimizer/projects/${id}/articles/${articleId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e]">
        <ArrowLeft className="h-4 w-4" /> Back to article
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">Latest analysis</p>
          <h1 className="mt-1 text-3xl font-bold text-[#1a1a2e]">{article.title}</h1>
          <p className="mt-2 text-sm text-gray-500">{analysis.createdAt.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-[#1a1a2e] px-7 py-5 text-center text-white">
          <div className="text-4xl font-bold">{analysis.overallScore ?? "—"}</div>
          <div className="text-xs uppercase tracking-wide text-gray-300">Overall / 100</div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scoreLabels.map(([label, key]) => (
          <div key={key} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-[#1a1a2e]">{analysis[key] ?? "—"}<span className="text-sm font-normal text-gray-400">/100</span></p>
          </div>
        ))}
      </div>

      {analysis.summary && <p className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">{analysis.summary}</p>}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Issues & recommendations</h2>
          <span className="text-sm text-gray-500">{issues.length} issues</span>
        </div>
        <div className="mt-4 space-y-4">
          {issues.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">No deterministic issues were detected. Review the article manually before publishing changes.</div>
          ) : issues.map((issue) => (
            <article key={issue.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">{issue.severity}</span>
                <span className="text-xs font-medium text-gray-500">{issue.category}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#1a1a2e]">{issue.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{issue.description}</p>
              {issue.suggestion && <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900"><strong>Recommended action:</strong> {issue.suggestion}</div>}
            </article>
          ))}
        </div>
      </section>

      <CompetitorIntelligence articleId={articleId} />\n\n      <div className="mt-8">
        <Link href={`/dashboard/optimizer/projects/${id}/articles/${articleId}/history`} className="text-sm font-semibold text-[#1a1a2e] underline">View analysis history</Link>
      </div>
    </main>
  )
}
