// src/app/admin/ai-content/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AIContentStudio } from "@/components/admin/ai/AIContentStudio"

export default async function AIContentStudioPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Content Studio</h1>
        <p className="text-gray-500">Generate content with AI assistance</p>
      </div>

      <div className="max-w-4xl">
        <AIContentStudio />
      </div>
    </div>
  )
}
