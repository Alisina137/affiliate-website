import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const decisionSchema = z.object({ decision: z.enum(["ACCEPT", "REJECT"]) })

export async function POST(request: Request, { params }: { params: Promise<{ id: string; optimizationId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, optimizationId } = await params
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 }) }
  const parsed = decisionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Decision must be ACCEPT or REJECT." }, { status: 400 })

  const optimization = await db.optimizerOptimization.findFirst({
    where: { id: optimizationId, articleId: id, userId: session.user.id, article: { project: { userId: session.user.id } } },
  })
  if (!optimization) return NextResponse.json({ error: "Optimization not found." }, { status: 404 })
  if (optimization.status !== "SUGGESTED") return NextResponse.json({ error: "This suggestion has already been decided." }, { status: 409 })

  const updated = await db.$transaction(async (tx) => {
    if (parsed.data.decision === "ACCEPT") {
      await tx.optimizerArticle.update({ where: { id }, data: { content: optimization.suggestedContent, status: "READY" } })
    }
    const saved = await tx.optimizerOptimization.update({
      where: { id: optimization.id },
      data: { status: parsed.data.decision === "ACCEPT" ? "ACCEPTED" : "REJECTED", decidedAt: new Date() },
    })
    await tx.optimizerUsage.create({
      data: { userId: session.user.id, action: `AI_OPTIMIZATION_${parsed.data.decision}ED`, metadata: { articleId: id, optimizationId: optimization.id } },
    })
    return saved
  })
  return NextResponse.json({ optimization: updated })
}
