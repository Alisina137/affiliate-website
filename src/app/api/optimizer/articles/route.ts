import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { optimizerArticleInputSchema } from "@/lib/optimizer/article-schema"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const projectId = new URL(request.url).searchParams.get("projectId")
  if (!projectId) return NextResponse.json({ error: "projectId is required." }, { status: 400 })

  const project = await db.optimizerProject.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  })
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 })

  const articles = await db.optimizerArticle.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { analyses: true } } },
  })

  return NextResponse.json({ articles })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const parsed = optimizerArticleInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid article data.", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const project = await db.optimizerProject.findFirst({
    where: { id: parsed.data.projectId, userId: session.user.id },
    select: { id: true },
  })
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 })

  const article = await db.$transaction(async (tx) => {
    const created = await tx.optimizerArticle.create({
      data: {
        projectId: project.id,
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

    await tx.optimizerUsage.create({
      data: {
        userId: session.user.id,
        action: "ARTICLE_CREATED",
        metadata: { projectId: project.id, articleId: created.id },
      },
    })

    return created
  })

  return NextResponse.json({ article }, { status: 201 })
}
