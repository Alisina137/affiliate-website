// src/types/auth.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "EDITOR" | "USER"
    } & DefaultSession["user"]
  }

  interface User {
    role: "ADMIN" | "EDITOR" | "USER"
  }
}
