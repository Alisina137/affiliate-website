// src/app/api/internal-links/suggestions/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { internalLinkingService } from "@/services/internal-linking.service"
import { z } from "zod"

const suggestionSchema = z.object({
  contentId: z.string(),
  contentType: z.string(),
  keywords: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = suggestionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { contentId, contentType, keywords = [] } = result.data

    let suggestions

    if (contentType === "product") {
      suggestions = await internalLinkingService.getRelatedForProduct(contentId)
    } else {
      suggestions = await internalLinkingService.getRelatedForContent(
        contentId,
        contentType,
        keywords
      )
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error getting suggestions:", error)
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    )
  }
}
