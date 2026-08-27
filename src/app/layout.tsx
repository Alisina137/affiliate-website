// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/auth"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Affiliate Platform",
  description: "Find the best products for your needs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
