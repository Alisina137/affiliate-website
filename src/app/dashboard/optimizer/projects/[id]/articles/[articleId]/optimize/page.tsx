import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { OptimizationWorkspace } from "@/components/optimizer/OptimizationWorkspace"

export const dynamic = "force-dynamic"

export default async function OptimizeArticlePage({ params }: { params: Promise<{ id: string; articleId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { id, articleId } = await params
  const article = await db.optimizerArticle.findFirst({
    where: { id: articleId, projectId: id, project: { userId: session.user.id } },
    include: { optimizations: { where: { userId: session.user.id }, orderBy: { createdAt: "desc" } } },
  })
  if (!article) notFound()
  if (!article.content) redirect(`/dashboard/optimizer/projects/${id}/articles/${articleId}`)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href={`/dashboard/optimizer/projects/${id}/articles/${articleId}`} className="text-sm text-gray-500">← Back to article</Link>
      <h1 className="mt-5 text-3xl font-bold text-[#1a1a2e]">Optimize article</h1>
      <p className="mt-2 text-gray-600">{article.title}</p>
      <div className="mt-8">
        <OptimizationWorkspace articleId={article.id} initialContent={article.content} initialOptimizations={article.optimizations} />
      </div>
    </main>
  )
}
