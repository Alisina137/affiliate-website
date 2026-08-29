// src/lib/auth/utils.ts
import { auth } from "./index"
import type { Session } from "next-auth"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function getSession() {
  return await auth()
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}

export function hasRole(user: any, role: string): boolean {
  return user?.role === role
}

export function isAdmin(user: any): boolean {
  return hasRole(user, "ADMIN")
}

export function isEditor(user: any): boolean {
  return hasRole(user, "EDITOR") || isAdmin(user)
}
