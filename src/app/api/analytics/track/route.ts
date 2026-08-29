// src/app/api/analytics/track/route.ts
import { NextResponse } from "next/server";
import { analyticsService } from "@/services/analytics.service";
import { z } from "zod";

const trackSchema = z.object({
  type: z.enum([
    "page_view",
    "affiliate_click",
    "product_view",
    "search",
    "newsletter_signup",
    "conversion",
  ]),
  sessionId: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  metadata: z.any().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = trackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 },
      );
    }

    const { type, sessionId, pageUrl, referrer, userAgent, metadata } =
      result.data;

    // Get IP from headers
    const ipAddress = request.headers.get("x-forwarded-for") || undefined;

    await analyticsService.trackEvent({
      type,
      sessionId,
      pageUrl,
      referrer,
      userAgent,
      ipAddress,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}
