// src/app/admin/affiliate-programs/new/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProgramForm } from "@/components/admin/affiliate-programs/ProgramForm"

export default async function NewProgramPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Affiliate Program</h1>
        <p className="text-gray-500">Add a new affiliate program</p>
      </div>

      <div className="max-w-2xl">
        <ProgramForm />
      </div>
    </div>
  )
}
