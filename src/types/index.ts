// src/types/index.ts
// Application-wide type definitions

export interface SiteConfig {
  name: string
  description: string
  url: string
  logo: string
  keywords: string[]
  author: string
}

export interface NavigationItem {
  title: string
  href: string
  items?: NavigationItem[]
}

export interface User {
  id: string
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  role: "ADMIN" | "EDITOR" | "USER"
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
