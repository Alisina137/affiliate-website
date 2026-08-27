import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className={cn("text-4xl font-bold text-blue-600")}>
        Affiliate Platform
      </div>
      <p className="mt-4 text-gray-600">
        Next.js 16 + TypeScript + Tailwind
      </p>
    </main>
  )
}
