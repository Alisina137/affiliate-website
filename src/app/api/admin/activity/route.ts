// src/app/api/admin/activity/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface Activity {
  id: string;
  type: string;
  action: string;
  title: string;
  url?: string;
  timestamp: Date;
  metadata?: Record<string, string | number | boolean | null>;
  user?: {
    name: string | null;
    email: string;
  };
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let activities: Activity[] = [];
    let total = 0;

    try {
      // Try to fetch from analytics events
      const events = await db.analyticsEvent.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      });

      // Get user info for each event
      const userIds = events
        .map((e) => e.userId)
        .filter((id): id is string => id !== null);
      const users =
        userIds.length > 0
          ? await db.user.findMany({
              where: { id: { in: userIds } },
              select: { id: true, name: true, email: true },
            })
          : [];

      const userMap = new Map(users.map((u) => [u.id, u]));

      activities = events.map((event) => {
        const metadata = event.metadata as Record<
          string,
          string | number | boolean | null
        > | null;
        const user = event.userId ? userMap.get(event.userId) : undefined;

        let title = event.pageUrl || "Unknown";
        if (metadata && metadata.productId) {
          title = `Product: ${metadata.productId}`;
        }

        return {
          id: event.id,
          type: event.type || "page_view",
          action: event.type === "page_view" ? "viewed" : "clicked",
          title: title,
          url: event.pageUrl || "/",
          timestamp: event.createdAt,
          metadata: metadata || undefined,
          user: user
            ? {
                name: user.name,
                email: user.email,
              }
            : undefined,
        };
      });

      total = await db.analyticsEvent.count();
    } catch (error) {
      console.log("AnalyticsEvent model not found or error:", error);
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit: limit,
        totalPages: 0,
      });
    }

    return NextResponse.json({
      data: activities,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
  }
}
