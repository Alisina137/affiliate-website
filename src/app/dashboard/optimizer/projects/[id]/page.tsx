import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, Plus } from "lucide-react"

export default async function OptimizerProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { id } = await params

  const project = await db.optimizerProject.findFirst({
    where: { id, userId: session.user.id },
    include: {
      articles: {
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { analyses: true } } },
      },
    },
  })
  if (!project) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/dashboard/optimizer/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e]">
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">{project.name}</h1>
          <p className="mt-1 text-gray-500">{project.domain || "Domain not set"}</p>
          {project.description && <p className="mt-4 max-w-3xl text-gray-600">{project.description}</p>}
        </div>
        <Link
          href={`/dashboard/optimizer/projects/${project.id}/articles/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add article
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1a1a2e]">Articles</h2>
          <span className="text-sm text-gray-500">{project.articles.length} total</span>
        </div>

        {project.articles.length === 0 ? (
          <div className="py-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-medium">No articles yet</p>
            <p className="mt-1 text-sm text-gray-500">Add your first affiliate article to prepare it for analysis.</p>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-gray-100">
            {project.articles.map((article) => (
              <Link
                key={article.id}
                href={`/dashboard/optimizer/projects/${project.id}/articles/${article.id}`}
                className="block py-4 hover:bg-gray-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#1a1a2e]">{article.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {article.targetQuery || "No target keyword"} · {article._count.analyses} analyses
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{article.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
