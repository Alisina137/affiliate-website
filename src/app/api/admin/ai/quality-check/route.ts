// src/app/api/admin/ai/quality-check/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const qualityCheckSchema = z.object({
  contentId: z.string(),
  contentType: z.string(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = qualityCheckSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { contentId, contentType } = result.data

    // Fetch the content based on type
    let content: any
    switch (contentType) {
      case "REVIEW":
        content = await db.review.findUnique({ where: { id: contentId } })
        break
      case "COMPARISON":
        content = await db.comparison.findUnique({ where: { id: contentId } })
        break
      case "BEST_OF":
        content = await db.bestOf.findUnique({ where: { id: contentId } })
        break
      case "GUIDE":
        content = await db.guide.findUnique({ where: { id: contentId } })
        break
      default:
        return NextResponse.json(
          { error: `Unsupported content type: ${contentType}` },
          { status: 400 }
        )
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      )
    }

    // Run quality checks
    const checks: any[] = []
    let passedCount = 0

    // Check 1: Title exists
    const hasTitle = !!content.title && content.title.length > 0
    checks.push({
      name: "Title exists",
      passed: hasTitle,
      severity: hasTitle ? "info" : "error",
      message: hasTitle ? `${content.title.length} characters` : "Title is required",
    })
    if (hasTitle) passedCount++

    // Check 2: Content length
    const hasContent = !!content.content && content.content.length > 100
    checks.push({
      name: "Content length",
      passed: hasContent,
      severity: hasContent ? "info" : "error",
      message: hasContent ? `${content.content.length} characters` : "Content must be at least 100 characters",
    })
    if (hasContent) passedCount++

    // Check 3: SEO Title
    const hasSeoTitle = !!content.seoTitle && content.seoTitle.length >= 30
    checks.push({
      name: "SEO Title",
      passed: hasSeoTitle,
      severity: hasSeoTitle ? "info" : "warning",
      message: hasSeoTitle ? `${content.seoTitle.length} characters` : "SEO title should be at least 30 characters",
    })
    if (hasSeoTitle) passedCount++

    // Check 4: Meta Description
    const hasMetaDesc = !!content.metaDescription && content.metaDescription.length >= 50
    checks.push({
      name: "Meta Description",
      passed: hasMetaDesc,
      severity: hasMetaDesc ? "info" : "warning",
      message: hasMetaDesc ? `${content.metaDescription.length} characters` : "Meta description should be at least 50 characters",
    })
    if (hasMetaDesc) passedCount++

    // Check 5: Featured Image (placeholder)
    checks.push({
      name: "Featured Image",
      passed: false,
      severity: "warning",
      message: "No featured image set",
    })

    // Check 6: Categories and tags
    const hasCategory = !!content.categoryId
    checks.push({
      name: "Category assigned",
      passed: hasCategory,
      severity: hasCategory ? "info" : "warning",
      message: hasCategory ? "Category assigned" : "No category assigned",
    })
    if (hasCategory) passedCount++

    // Check 7: Author
    const hasAuthor = !!content.authorId
    checks.push({
      name: "Author assigned",
      passed: hasAuthor,
      severity: hasAuthor ? "info" : "error",
      message: hasAuthor ? "Author assigned" : "No author assigned",
    })
    if (hasAuthor) passedCount++

    // Check 8: Review-specific checks
    if (contentType === "REVIEW") {
      const hasRating = !!content.rating && content.rating > 0
      checks.push({
        name: "Rating provided",
        passed: hasRating,
        severity: hasRating ? "info" : "warning",
        message: hasRating ? `Rating: ${content.rating}/5` : "No rating provided",
      })
      if (hasRating) passedCount++

      const hasProsCons = (content.pros?.length || 0) > 0 && (content.cons?.length || 0) > 0
      checks.push({
        name: "Pros & Cons",
        passed: hasProsCons,
        severity: hasProsCons ? "info" : "warning",
        message: hasProsCons ? `${content.pros?.length} pros, ${content.cons?.length} cons` : "Missing pros/cons",
      })
      if (hasProsCons) passedCount++
    }

    // Check 9: Guide-specific checks
    if (contentType === "GUIDE") {
      const hasIntroduction = !!content.introduction && content.introduction.length > 20
      checks.push({
        name: "Introduction",
        passed: hasIntroduction,
        severity: hasIntroduction ? "info" : "warning",
        message: hasIntroduction ? "Introduction provided" : "Missing introduction",
      })
      if (hasIntroduction) passedCount++
    }

    // Calculate overall score
    const totalChecks = checks.length
    const overallScore = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 0
    const isReady = overallScore >= 70 && checks.filter(c => !c.passed && c.severity === "error").length === 0

    return NextResponse.json({
      checks,
      overallScore,
      isReady,
      totalChecks,
      passedCount,
    })
  } catch (error) {
    console.error("Quality check error:", error)
    return NextResponse.json(
      { error: "Failed to run quality checks" },
      { status: 500 }
    )
  }
}
