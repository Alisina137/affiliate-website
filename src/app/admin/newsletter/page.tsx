// src/app/admin/newsletter/page.tsx
import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SubscriberList } from "@/components/admin/newsletter/SubscriberList"
import { NewsletterStats } from "@/components/admin/newsletter/NewsletterStats"

export const metadata: Metadata = {
  title: "Newsletter Management",
  description: "Manage newsletter subscribers",
}

export default async function NewsletterAdminPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Newsletter Management</h1>
      
      <div className="space-y-8">
        {/* Stats */}
        <NewsletterStats />
        
        {/* Subscriber List */}
        <SubscriberList />
      </div>
    </div>
  )
}
