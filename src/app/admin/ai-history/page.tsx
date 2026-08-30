// src/app/admin/ai-history/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AIGenerationHistory } from "@/components/admin/ai/AIGenerationHistory"

export default async function AIHistoryPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Generation History</h1>
        <p className="text-gray-500">View all AI content generations</p>
      </div>

      <AIGenerationHistory />
    </div>
  )
}
