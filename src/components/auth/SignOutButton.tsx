// src/components/auth/SignOutButton.tsx
"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      Sign Out
    </button>
  )
}
