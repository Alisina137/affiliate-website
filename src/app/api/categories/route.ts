// src/app/api/categories/route.ts
import { NextResponse } from "next/server"
import { categoryService } from "@/services"

export async function GET() {
  try {
    const categories = await categoryService.getAll()
    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
