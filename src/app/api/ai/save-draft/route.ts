// src/app/api/ai/save-draft/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { contentType, content, topic, products } = body;

    // Validate required fields
    if (!contentType || !content) {
      return NextResponse.json(
        { error: "Content type and content are required" },
        { status: 400 },
      );
    }

    console.log("📝 Saving draft:", { contentType, topic });

    // Save based on content type
    let savedContent;
    const authorId = session.user.id;
    const title = content.title || topic || "Untitled";
    const slug =
      content.slug ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    switch (contentType) {
      case "REVIEW":
        savedContent = await db.review.create({
          data: {
            title: title,
            slug: slug,
            content: content.content || "",
            excerpt: content.excerpt || "",
            rating: 0,
            pros: content.pros || [],
            cons: content.cons || [],
            verdict: content.verdict || "",
            bestFor: content.bestFor || "",
            seoTitle: content.seoTitle || title,
            metaDescription: content.metaDescription || "",
            productId: products?.[0] || "",
            authorId: authorId,
            status: "DRAFT",
          },
        });
        break;

      case "COMPARISON":
        savedContent = await db.comparison.create({
          data: {
            title: title,
            slug: slug,
            content: content.content || "",
            excerpt: content.excerpt || "",
            winner: content.winner || "",
            winnerExplanation: content.winnerExplanation || "",
            seoTitle: content.seoTitle || title,
            metaDescription: content.metaDescription || "",
            authorId: authorId,
            status: "DRAFT",
          },
        });
        break;

      case "BEST_OF":
        savedContent = await db.bestOf.create({
          data: {
            title: title,
            slug: slug,
            content: content.content || "",
            excerpt: content.excerpt || "",
            introduction: content.introduction || "",
            seoTitle: content.seoTitle || title,
            metaDescription: content.metaDescription || "",
            authorId: authorId,
            status: "DRAFT",
          },
        });
        break;

      case "GUIDE":
        savedContent = await db.guide.create({
          data: {
            title: title,
            slug: slug,
            content: content.content || "",
            excerpt: content.excerpt || "",
            introduction: content.introduction || "",
            seoTitle: content.seoTitle || title,
            metaDescription: content.metaDescription || "",
            authorId: authorId,
            status: "DRAFT",
          },
        });
        break;

      default:
        return NextResponse.json(
          {
            error: `Unsupported content type: ${contentType}. Supported types: REVIEW, COMPARISON, BEST_OF, GUIDE`,
          },
          { status: 400 },
        );
    }

    console.log("✅ Draft saved:", savedContent.id);

    return NextResponse.json({
      success: true,
      data: savedContent,
      message: "Draft saved successfully!",
    });
  } catch (error) {
    console.error("Save draft error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save draft",
      },
      { status: 500 },
    );
  }
}
