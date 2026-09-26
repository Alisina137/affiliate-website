import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { analyzeCompetitors } from "@/lib/optimizer/competitor-intelligence"

export const runtime = "nodejs"

const requestSchema = z.object({
  urls: z.array(z.string().url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "Only HTTP/HTTPS URLs are allowed.")).min(1).max(5),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const article = await db.optimizerArticle.findFirst({
    where: { id, project: { userId: session.user.id } },
    select: { id: true, content: true },
  })
  if (!article) return NextResponse.json({ error: "Article not found." }, { status: 404 })
  if (!article.content?.trim()) return NextResponse.json({ error: "Article content is required." }, { status: 400 })

  const body = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid competitor URLs." }, { status: 400 })

  try {
    const intelligence = await analyzeCompetitors(article.content, parsed.data.urls)
    await db.optimizerUsage.create({
      data: { userId: session.user.id, action: "COMPETITOR_ANALYZED", metadata: { articleId: article.id, source: intelligence.source, competitorCount: intelligence.competitors.length } },
    })
    return NextResponse.json({ intelligence })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Competitor analysis failed." }, { status: 422 })
  }
}
