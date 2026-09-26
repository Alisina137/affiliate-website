import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { extractArticle } from "@/lib/optimizer/article-extractor"
import { SafeFetchError, safeFetchHtml } from "@/lib/optimizer/safe-fetch"

export const runtime = "nodejs"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const article = await db.optimizerArticle.findFirst({
    where: { id, project: { userId: session.user.id } },
    select: { id: true, sourceUrl: true },
  })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })
  if (!article.sourceUrl) return NextResponse.json({ error: "Add a source URL before importing." }, { status: 400 })

  try {
    const fetched = await safeFetchHtml(article.sourceUrl)
    const extracted = extractArticle(fetched.html)

    const updated = await db.$transaction(async (tx) => {
      const saved = await tx.optimizerArticle.update({
        where: { id: article.id },
        data: {
          title: extracted.title,
          sourceUrl: fetched.finalUrl,
          content: extracted.content.slice(0, 150000),
          status: "READY",
        },
      })
      await tx.optimizerUsage.create({
        data: {
          userId: session.user.id,
          action: "ARTICLE_IMPORTED",
          metadata: { articleId: article.id, finalUrl: fetched.finalUrl, characters: saved.content?.length ?? 0 },
        },
      })
      return saved
    })

    return NextResponse.json({ article: updated })
  } catch (error) {
    const message = error instanceof SafeFetchError
      ? error.message
      : error instanceof Error ? error.message : "Could not extract article content."

    await db.optimizerArticle.update({ where: { id: article.id }, data: { status: "IMPORT_FAILED" } })
    await db.optimizerUsage.create({
      data: {
        userId: session.user.id,
        action: "ARTICLE_IMPORT_FAILED",
        metadata: { articleId: article.id, reason: error instanceof SafeFetchError ? error.code : "EXTRACTION_FAILED" },
      },
    })

    return NextResponse.json({
      error: message,
      fallback: "This site may block automated extraction. You can paste the article content manually and save it instead.",
    }, { status: 422 })
  }
}
