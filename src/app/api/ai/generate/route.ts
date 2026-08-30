// src/app/api/ai/generate/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { aiGenerationService } from "@/services/ai-generation.service"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { contentType, topic, category, products, audience, keywords, instructions, tone, depth } = body

    if (!contentType || !topic) {
      return NextResponse.json(
        { error: "Content type and topic are required" },
        { status: 400 }
      )
    }

    console.log("🔍 Generating content for:", { contentType, topic })

    // Handle keywords - if it's a string, split it; if it's already an array, use it
    let keywordsArray: string[] = []
    if (keywords) {
      if (Array.isArray(keywords)) {
        keywordsArray = keywords
      } else if (typeof keywords === "string") {
        keywordsArray = keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      }
    }

    const result = await aiGenerationService.generateContent({
      contentType,
      topic,
      category,
      products: products || [],
      audience: audience || "",
      keywords: keywordsArray,
      instructions: instructions || "",
      tone: tone || "Expert",
      depth: depth || "Deep",
    })

    if (!result.success) {
      console.error("❌ Generation failed:", result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Store generation in database (optional)
    try {
      await db.aIGeneration.create({
        data: {
          userId: session.user.id,
          contentType,
          operation: "GENERATE",
          model: process.env.GOOGLE_GEMINI_API_KEY ? "gemini-2.0-flash" : "cerebras-llama3.1-8b",
          input: { topic, category, products, audience, keywords: keywordsArray, instructions },
          output: result.data,
          status: "SUCCESS",
        },
      })
    } catch (dbError) {
      console.error("Failed to store generation:", dbError)
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    )
  }
}
