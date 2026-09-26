import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CreditCard, FileText, FolderKanban, Gauge, Plus } from "lucide-react"


export const dynamic = "force-dynamic"
export default async function OptimizerDashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [projects, analyses, usage] = await Promise.all([
    db.optimizerProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { _count: { select: { articles: true } } },
    }),
    db.optimizerAnalysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { article: { select: { title: true, projectId: true } } },
    }),
    db.optimizerUsage.aggregate({
      where: { userId: session.user.id },
      _sum: { units: true },
    }),
  ])

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Affiliate Optimizer</p>
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Content & monetization workspace</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">Create projects, add affiliate articles, and prepare them for evidence-based SEO, content, trust, and monetization analysis.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/optimizer/billing" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a2e]">
            <CreditCard className="h-4 w-4" /> Plan & usage
          </Link>
          <Link href="/dashboard/optimizer/projects/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> New project
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Metric icon={<FolderKanban className="h-5 w-5" />} label="Projects" value={projects.length} />
        <Metric icon={<Gauge className="h-5 w-5" />} label="Recent analyses" value={analyses.length} />
        <Metric icon={<FileText className="h-5 w-5" />} label="Usage units" value={usage._sum.units ?? 0} />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1a1a2e]">Recent projects</h2>
          <Link href="/dashboard/optimizer/projects" className="text-sm font-medium text-indigo-600">View all</Link>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <FolderKanban className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-semibold text-[#1a1a2e]">Create your first optimizer project</h3>
            <p className="mt-1 text-sm text-gray-500">Projects keep your site, articles, and future analyses isolated and organized.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/optimizer/projects/${project.id}`} className="flex items-center justify-between py-4 group">
                <div>
                  <p className="font-medium text-[#1a1a2e]">{project.name}</p>
                  <p className="text-sm text-gray-500">{project.domain || "No domain yet"} · {project._count.articles} articles</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#1a1a2e]" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-center gap-2 text-gray-500">{icon}<span className="text-sm">{label}</span></div><p className="mt-3 text-3xl font-bold text-[#1a1a2e]">{value}</p></div>
}
