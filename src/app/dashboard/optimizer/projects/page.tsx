import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function OptimizerProjectsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const projects = await db.optimizerProject.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { articles: true } } },
  })

  return <main className="max-w-5xl mx-auto px-4 py-10">
    <div className="flex items-center justify-between mb-8"><div><h1 className="text-3xl font-bold text-[#1a1a2e]">Optimizer projects</h1><p className="text-gray-500 mt-1">Each project represents one affiliate site or focused content property.</p></div><Link href="/dashboard/optimizer/projects/new" className="inline-flex gap-2 items-center rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-white text-sm font-semibold"><Plus className="h-4 w-4"/>New project</Link></div>
    <div className="grid gap-4">{projects.map(p=><Link key={p.id} href={`/dashboard/optimizer/projects/${p.id}`} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300"><h2 className="font-semibold text-lg text-[#1a1a2e]">{p.name}</h2><p className="text-sm text-gray-500 mt-1">{p.domain || "Domain not set"} · {p._count.articles} articles</p>{p.description && <p className="text-sm text-gray-600 mt-3">{p.description}</p>}</Link>)}</div>
    {projects.length===0 && <p className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">No optimizer projects yet.</p>}
  </main>
}
