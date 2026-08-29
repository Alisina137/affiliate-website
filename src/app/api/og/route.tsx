// src/app/api/og/route.tsx
import { NextRequest } from "next/server"
import { ImageResponse } from "next/og"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title") || "Affiliate Platform"
    const description = searchParams.get("description") || "Find the best products"
    const type = searchParams.get("type") || "website"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "80px",
            backgroundColor: "#1a1a2e",
            backgroundImage: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "80%",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#60a5fa",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {type === "article" ? "📝 Article" : type === "product" ? "🛒 Product" : "🔍 Affiliate Platform"}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#94a3b8",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 40,
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#60a5fa",
                }}
              >
                Affiliate Platform
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#475569",
                }}
              />
              <div
                style={{
                  fontSize: 16,
                  color: "#64748b",
                }}
              >
                Product Reviews & Comparisons
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
