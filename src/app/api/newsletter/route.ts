// src/app/api/newsletter/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = newsletterSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { email, name } = result.data

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        )
      } else {
        // Reactivate
        await db.subscriber.update({
          where: { email },
          data: { isActive: true },
        })
        return NextResponse.json(
          { success: true, message: "Successfully resubscribed!" },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    await db.subscriber.create({
      data: {
        email,
        name: name || null,
        source: "homepage",
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully subscribed to the newsletter!" 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
