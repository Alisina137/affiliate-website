// src/app/dashboard/layout.tsx
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <DashboardHeader />
      {children}
    </div>
  )
}
