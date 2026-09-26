import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CreateArticleForm } from "@/components/optimizer/CreateArticleForm"


export const dynamic = "force-dynamic"
export default async function NewOptimizerArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { id } = await params

  const project = await db.optimizerProject.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, name: true },
  })
  if (!project) notFound()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/dashboard/optimizer/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e]">
        <ArrowLeft className="h-4 w-4" />
        {project.name}
      </Link>
      <div className="mt-5 mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Add article</h1>
        <p className="mt-1 text-gray-500">Add a URL, pasted content, target keyword, and optional secondary keywords.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <CreateArticleForm projectId={project.id} />
      </div>
    </main>
  )
}
