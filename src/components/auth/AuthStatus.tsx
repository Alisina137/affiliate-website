// src/components/auth/AuthStatus.tsx
"use client"

import { useSession } from "next-auth/react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <span className="text-sm text-gray-500">Loading...</span>
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Welcome, {session.user.name || session.user.email}
        </span>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {session.user.role}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <a href="/login" className="text-sm text-blue-600 hover:text-blue-800">
        Sign In
      </a>
      <a
        href="/register"
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Sign Up
      </a>
    </div>
  )
}
