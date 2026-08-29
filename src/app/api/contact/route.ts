// src/app/api/contact/route.ts
import { NextResponse } from "next/server"
import { validateAndRespond } from "@/lib/validation/middleware"
import { contactSchema } from "@/lib/validation/schemas"
import { sanitizeObject } from "@/lib/validation/sanitize"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate and sanitize
    const validation = validateAndRespond(contactSchema, body, { sanitize: true })
    
    if (!validation.success) {
      return validation.response
    }

    const { name, email, subject, message } = validation.data

    // Sanitize message content
    const sanitizedMessage = sanitizeObject({ message }, { html: true }).message

    // TODO: Send email notification
    console.log(`Contact Form Submission:
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${sanitizedMessage}
    `)

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
