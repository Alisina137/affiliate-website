// src/app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { newsletterService } from "@/services/newsletter.service"

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { email, name, source } = result.data

    const response = await newsletterService.subscribe(email, name, source)

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: true, message: response.message },
      { status: 200 }
    )
  } catch (error) {
    console.error("Newsletter subscribe error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
