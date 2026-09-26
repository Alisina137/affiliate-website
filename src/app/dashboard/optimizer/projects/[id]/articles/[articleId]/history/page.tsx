import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function OptimizerHistoryPage({ params }: { params: Promise<{ id: string; articleId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { id, articleId } = await params
  const article = await db.optimizerArticle.findFirst({
    where: { id: articleId, projectId: id, project: { userId: session.user.id } },
    select: { title: true },
  })
  if (!article) notFound()
  const analyses = await db.optimizerAnalysis.findMany({
    where: { articleId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/dashboard/optimizer/projects/${id}/articles/${articleId}/analysis`} className="text-sm text-gray-500">← Latest analysis</Link>
      <h1 className="mt-5 text-3xl font-bold text-[#1a1a2e]">Analysis history</h1>
      <p className="mt-2 text-gray-600">{article.title}</p>
      <div className="mt-8 space-y-3">
        {analyses.length === 0 ? <p className="rounded-xl border bg-white p-6 text-gray-600">No analyses yet.</p> : analyses.map((analysis, index) => {
          const older = analyses[index + 1]
          const change = analysis.overallScore != null && older?.overallScore != null ? analysis.overallScore - older.overallScore : null
          return (
            <div key={analysis.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <div><p className="font-semibold">{analysis.createdAt.toLocaleString()}</p><p className="text-sm text-gray-500">{analysis.status}</p></div>
              <div className="text-right"><p className="text-2xl font-bold">{analysis.overallScore ?? "—"}/100</p>{change != null && <p className="text-xs text-gray-500">{change > 0 ? "+" : ""}{change} vs previous</p>}</div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
