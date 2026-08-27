// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { loginSchema } from "@/lib/auth/validations"
import { AuthError } from "next-auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    // Use NextAuth's signIn function
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
    } catch (error) {
      // If the error is an AuthError, return the message
      if (error instanceof AuthError) {
        console.error("AuthError:", error.type, error.message)
        return NextResponse.json(
          { error: error.message || "Invalid credentials" },
          { status: 401 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
