import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { analyzeArticle } from "@/lib/optimizer/analysis-engine"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const article = await db.optimizerArticle.findFirst({
    where: { id, project: { userId: session.user.id } },
    select: { id: true, title: true, content: true, targetQuery: true, sourceUrl: true, secondaryKeywords: true, country: true, language: true },
  })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })
  if (!article.content?.trim()) return NextResponse.json({ error: "Article content is required before analysis." }, { status: 400 })
  if (!article.targetQuery?.trim()) return NextResponse.json({ error: "A target keyword is required before analysis." }, { status: 400 })

  const result = analyzeArticle({
    title: article.title,
    content: article.content,
    targetQuery: article.targetQuery,
    sourceUrl: article.sourceUrl,
  })

  const analysis = await db.$transaction(async (tx) => {
    const created = await tx.optimizerAnalysis.create({
      data: {
        articleId: article.id,
        userId: session.user.id,
        status: "COMPLETED",
        overallScore: result.overallScore,
        seoScore: result.scores.seo,
        contentScore: result.scores.content,
        intentScore: result.scores.intent,
        affiliateScore: result.scores.affiliate,
        conversionScore: result.scores.conversion,
        technicalScore: result.scores.technical,
        summary: result.summary,
        inputSnapshot: {
          title: article.title,
          targetQuery: article.targetQuery,
          secondaryKeywords: article.secondaryKeywords,
          sourceUrl: article.sourceUrl,
          country: article.country,
          language: article.language,
          contentCharacters: article.content?.length ?? 0,
        },
        analysisData: result.data,
        completedAt: new Date(),
        issues: {
          create: result.issues.map((issue) => ({
            category: issue.category,
            severity: issue.severity,
            title: issue.title,
            description: issue.description,
            suggestion: issue.suggestion,
            evidence: issue.evidence,
          })),
        },
      },
      include: { issues: true },
    })
    await tx.optimizerUsage.create({
      data: { userId: session.user.id, action: "ARTICLE_ANALYZED", metadata: { articleId: article.id, analysisId: created.id } },
    })
    return created
  })

  return NextResponse.json({ analysis }, { status: 201 })
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const article = await db.optimizerArticle.findFirst({ where: { id, project: { userId: session.user.id } }, select: { id: true } })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })
  const analyses = await db.optimizerAnalysis.findMany({
    where: { articleId: id, userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { issues: { orderBy: { createdAt: "asc" } } },
  })
  return NextResponse.json({ analyses })
}
