// src/lib/auth/utils.ts
import { auth } from "./index";
import type { Session } from "next-auth";

// Define proper types
export interface AppUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  image?: string | null;
}

// Extend Session with our AppUser type
export interface AppSession extends Session {
  user: AppUser & {
    id: string;
    role: string;
  };
}

export async function getCurrentUser(): Promise<AppUser | undefined> {
  const session = await auth();
  return session?.user as AppUser | undefined;
}

export async function getSession(): Promise<AppSession | null> {
  const session = await auth();
  return session as AppSession | null;
}

export function isAuthenticated(
  session: AppSession | null | undefined,
): boolean {
  return !!session?.user;
}

export function hasRole(
  user: AppUser | null | undefined,
  role: string,
): boolean {
  return user?.role === role;
}

export function isAdmin(user: AppUser | null | undefined): boolean {
  return hasRole(user, "ADMIN");
}

export function isEditor(user: AppUser | null | undefined): boolean {
  return hasRole(user, "EDITOR") || isAdmin(user);
}
