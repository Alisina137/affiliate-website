import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EditArticleForm } from "@/components/optimizer/EditArticleForm"


export const dynamic = "force-dynamic"
export default async function OptimizerArticlePage({
  params,
}: {
  params: Promise<{ id: string; articleId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { id, articleId } = await params

  const article = await db.optimizerArticle.findFirst({
    where: { id: articleId, projectId: id, project: { userId: session.user.id } },
    include: { _count: { select: { analyses: true } }, project: { select: { name: true } } },
  })
  if (!article) notFound()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/dashboard/optimizer/projects/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e]">
        <ArrowLeft className="h-4 w-4" />
        {article.project.name}
      </Link>
      <div className="mt-5 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-[#1a1a2e]">{article.title}</h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{article.status}</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {article._count.analyses} analyses · Last updated {article.updatedAt.toLocaleDateString()}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <EditArticleForm article={article} />
      </div>
    </main>
  )
}
