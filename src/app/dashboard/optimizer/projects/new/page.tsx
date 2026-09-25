import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateProjectForm } from "@/components/optimizer/CreateProjectForm"

export default async function NewOptimizerProjectPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  return <main className="max-w-2xl mx-auto px-4 py-10"><h1 className="text-3xl font-bold text-[#1a1a2e]">New optimizer project</h1><p className="mt-2 text-gray-500">Add the affiliate site you want to optimize. You can add articles after creating the project.</p><div className="mt-8 rounded-xl border border-gray-200 bg-white p-6"><CreateProjectForm /></div></main>
}
