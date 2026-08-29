// src/app/api/newsletter/unsubscribe/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { newsletterService } from "@/services/newsletter.service"

const unsubscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = unsubscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { email } = result.data

    const response = await newsletterService.unsubscribe(email)

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: response.message },
      { status: 200 }
    )
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
