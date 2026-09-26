"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateProjectForm() {
  const router = useRouter()
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState("")
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("")
    const form=new FormData(e.currentTarget)
    const response=await fetch("/api/optimizer/projects",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.get("name"),domain:form.get("domain"),description:form.get("description")})})
    const data=await response.json()
    if(!response.ok){setError(data.error || "Could not create project.");setBusy(false);return}
    router.push(`/dashboard/optimizer/projects/${data.project.id}`);router.refresh()
  }
  return <form onSubmit={submit} className="space-y-5">
    <label className="block"><span className="text-sm font-medium">Project name</span><input name="name" required maxLength={120} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Walking Pad Affiliate Site"/></label>
    <label className="block"><span className="text-sm font-medium">Domain</span><input name="domain" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="example.com"/></label>
    <label className="block"><span className="text-sm font-medium">Description</span><textarea name="description" rows={4} maxLength={1000} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="What this affiliate property covers..."/></label>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <button disabled={busy} className="rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy?"Creating...":"Create project"}</button>
  </form>
}
