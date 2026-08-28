// src/app/api/reviews/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "PUBLISHED"
  const limit = parseInt(searchParams.get("limit") || "4")

  // Temporary mock data
  const reviews = [
    {
      id: "1",
      title: "The Best Headphones I've Ever Used",
      slug: "best-headphones-ever-used",
      excerpt: "After weeks of testing, these headphones deliver exceptional sound quality and comfort...",
      rating: 4.8,
      productName: "Premium Wireless Headphones",
      productSlug: "premium-wireless-headphones",
      authorName: "John Doe",
      publishedAt: new Date("2026-08-20"),
    },
    {
      id: "2",
      title: "Ultra-Slim Laptop Pro Review",
      slug: "ultra-slim-laptop-pro-review",
      excerpt: "A powerful laptop that doesn't compromise on portability. Perfect for professionals on the go...",
      rating: 4.6,
      productName: "Ultra-Slim Laptop Pro",
      productSlug: "ultra-slim-laptop-pro",
      authorName: "Jane Smith",
      publishedAt: new Date("2026-08-15"),
    },
    {
      id: "3",
      title: "Smart Fitness Watch: A Game Changer",
      slug: "smart-fitness-watch-game-changer",
      excerpt: "This smartwatch has completely transformed my fitness routine with its accurate tracking...",
      rating: 4.4,
      productName: "Smart Fitness Watch",
      productSlug: "smart-fitness-watch",
      authorName: "Mike Johnson",
      publishedAt: new Date("2026-08-10"),
    },
    {
      id: "4",
      title: "4K Action Camera Review",
      slug: "4k-action-camera-review",
      excerpt: "Capture your adventures in stunning 4K with this compact and durable action camera...",
      rating: 4.7,
      productName: "4K Action Camera",
      productSlug: "4k-action-camera",
      authorName: "Sarah Williams",
      publishedAt: new Date("2026-08-05"),
    },
  ]

  return NextResponse.json({
    data: reviews.slice(0, limit),
    total: reviews.length,
    page: 1,
    limit,
    totalPages: 1,
  })
}
