import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default async function OptimizerProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session=await auth()
  if(!session?.user?.id) redirect("/login")
  const {id}=await params
  const project=await db.optimizerProject.findFirst({
    where:{id,userId:session.user.id},
    include:{articles:{orderBy:{updatedAt:"desc"},include:{_count:{select:{analyses:true}}}}},
  })
  if(!project) notFound()

  return <main className="max-w-5xl mx-auto px-4 py-10">
    <Link href="/dashboard/optimizer/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e]"><ArrowLeft className="h-4 w-4"/>Projects</Link>
    <div className="mt-5"><h1 className="text-3xl font-bold text-[#1a1a2e]">{project.name}</h1><p className="mt-1 text-gray-500">{project.domain || "Domain not set"}</p>{project.description&&<p className="mt-4 text-gray-600 max-w-3xl">{project.description}</p>}</div>
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-[#1a1a2e]">Articles</h2>
      {project.articles.length===0?<div className="py-10 text-center"><FileText className="h-10 w-10 text-gray-300 mx-auto"/><p className="mt-3 font-medium">No articles yet</p><p className="text-sm text-gray-500 mt-1">Article ingestion is the next implementation phase.</p></div>:<div className="divide-y divide-gray-100 mt-3">{project.articles.map(a=><div key={a.id} className="py-4"><p className="font-medium">{a.title}</p><p className="text-sm text-gray-500">{a._count.analyses} analyses</p></div>)}</div>}
    </section>
  </main>
}
