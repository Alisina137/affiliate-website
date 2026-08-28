// src/app/api/contact/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = result.data

    // TODO: Send email notification
    // For now, just log it
    console.log(`Contact Form Submission:
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `)

    // TODO: Store in database or send to email service

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
