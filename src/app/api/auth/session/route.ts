// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ 
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    )
  }
}
