// src/app/page.tsx
import { AuthStatus } from "@/components/auth"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Affiliate Platform</h1>
          <AuthStatus />
        </div>
        <p className="text-gray-600 text-lg">
          Welcome to the affiliate platform. Sign in to access your dashboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="font-semibold">Products</h3>
            <p className="text-sm text-gray-500">Browse and manage products</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="font-semibold">Content</h3>
            <p className="text-sm text-gray-500">Create and manage content</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-gray-500">Track performance</p>
          </div>
        </div>
      </div>
    </main>
  )
}
