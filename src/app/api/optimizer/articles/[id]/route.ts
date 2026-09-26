import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { optimizerArticleInputSchema } from "@/lib/optimizer/article-schema"

const updateSchema = optimizerArticleInputSchema.omit({ projectId: true })

async function findOwnedArticle(id: string, userId: string) {
  return db.optimizerArticle.findFirst({
    where: { id, project: { userId } },
    select: { id: true, projectId: true },
  })
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const article = await db.optimizerArticle.findFirst({
    where: { id, project: { userId: session.user.id } },
    include: { _count: { select: { analyses: true } } },
  })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })

  return NextResponse.json({ article })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const owned = await findOwnedArticle(id, session.user.id)
  if (!owned) return NextResponse.json({ error: "Article not found." }, { status: 404 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid article data.", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const article = await db.optimizerArticle.update({
    where: { id: owned.id },
    data: {
      title: parsed.data.title,
      sourceUrl: parsed.data.sourceUrl || null,
      content: parsed.data.content || null,
      targetQuery: parsed.data.targetQuery,
      secondaryKeywords: parsed.data.secondaryKeywords,
      country: parsed.data.country,
      language: parsed.data.language,
      status: parsed.data.content ? "READY" : "PENDING_IMPORT",
    },
  })

  return NextResponse.json({ article })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const owned = await findOwnedArticle(id, session.user.id)
  if (!owned) return NextResponse.json({ error: "Article not found." }, { status: 404 })

  await db.optimizerArticle.delete({ where: { id: owned.id } })
  return NextResponse.json({ ok: true })
}
