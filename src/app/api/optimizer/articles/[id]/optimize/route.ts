import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { assertOptimizerUsageAllowed } from "@/lib/optimizer/entitlements"
import { getOptimizerAIProvider, optimizationOperationSchema, OptimizerAIProviderError } from "@/lib/optimizer/ai/provider"
import { z } from "zod"

const requestSchema = z.object({
  operation: optimizationOperationSchema,
  originalContent: z.string().min(1).max(50000),
  instructions: z.string().max(1000).optional(),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const article = await db.optimizerArticle.findFirst({
    where: { id, project: { userId: session.user.id } },
    select: { id: true, title: true, targetQuery: true },
  })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })
  if (!article.targetQuery?.trim()) return NextResponse.json({ error: "A target keyword is required." }, { status: 400 })

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 }) }
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid optimization request." }, { status: 400 })

  try {
    await assertOptimizerUsageAllowed(session.user.id, "AI_OPTIMIZATION_CREATED")
  } catch (error) {
    const e = error as Error & { status?: number; code?: string; limit?: number; used?: number }
    return NextResponse.json({ error: e.message, code: e.code, limit: e.limit, used: e.used }, { status: e.status || 500 })
  }

  const provider = getOptimizerAIProvider()
  try {
    const result = await provider.optimize({
      operation: parsed.data.operation,
      originalContent: parsed.data.originalContent,
      targetQuery: article.targetQuery,
      articleTitle: article.title,
      instructions: parsed.data.instructions,
    }))

    const optimization = await db.$transaction(async (tx) => {
      const created = await tx.optimizerOptimization.create({
        data: {
          articleId: article.id,
          userId: session.user.id,
          operation: parsed.data.operation,
          provider: provider.name,
          model: provider.model,
          originalContent: parsed.data.originalContent,
          suggestedContent: result.suggestedContent,
          rationale: result.rationale,
          warnings: result.warnings,
          metadata: { instructions: parsed.data.instructions || null, inputTokens: result.usage?.inputTokens ?? null, outputTokens: result.usage?.outputTokens ?? null },
        },
      })
      await tx.optimizerUsage.create({
        data: { userId: session.user.id, action: "AI_OPTIMIZATION_CREATED", metadata: { articleId: article.id, optimizationId: created.id, operation: parsed.data.operation, provider: provider.name, model: provider.model, inputTokens: result.usage?.inputTokens ?? null, outputTokens: result.usage?.outputTokens ?? null } },
      })
      return created
    })
    return NextResponse.json({ optimization }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Optimization failed." }, { status: 502 })
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const article = await db.optimizerArticle.findFirst({ where: { id, project: { userId: session.user.id } }, select: { id: true } })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })
  const optimizations = await db.optimizerOptimization.findMany({ where: { articleId: id, userId: session.user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ optimizations })
}
