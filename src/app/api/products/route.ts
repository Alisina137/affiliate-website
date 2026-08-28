// src/app/api/products/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured") === "true"
  const limit = parseInt(searchParams.get("limit") || "4")

  // Temporary mock data
  const products = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      image: null,
      price: 299.99,
      currency: "USD",
      rating: 4.8,
      reviewCount: 156,
      brand: { name: "SoundTech", slug: "soundtech" },
    },
    {
      id: "2",
      name: "Ultra-Slim Laptop Pro",
      slug: "ultra-slim-laptop-pro",
      image: null,
      price: 1299.99,
      currency: "USD",
      rating: 4.6,
      reviewCount: 89,
      brand: { name: "TechCorp", slug: "techcorp" },
    },
    {
      id: "3",
      name: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      image: null,
      price: 249.99,
      currency: "USD",
      rating: 4.4,
      reviewCount: 234,
      brand: { name: "FitLife", slug: "fitlife" },
    },
    {
      id: "4",
      name: "4K Action Camera",
      slug: "4k-action-camera",
      image: null,
      price: 399.99,
      currency: "USD",
      rating: 4.7,
      reviewCount: 102,
      brand: { name: "ActionPro", slug: "actionpro" },
    },
  ]

  const data = featured ? products.filter((p) => p.rating >= 4.5) : products

  return NextResponse.json({
    data: data.slice(0, limit),
    total: data.length,
    page: 1,
    limit,
    totalPages: 1,
  })
}
