// src/types/user.ts
import { User as PrismaUser } from "@prisma/client"

export type User = PrismaUser

export type Role = "ADMIN" | "EDITOR" | "USER"

export interface CreateUserInput {
  email: string
  password?: string
  name?: string
  image?: string
}

export interface UpdateUserInput {
  name?: string
  image?: string
  password?: string
}
