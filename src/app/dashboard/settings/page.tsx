// src/app/dashboard/settings/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { ArrowLeft } from "lucide-react"

export default async function DashboardSettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
        >
          <ArrowLeft className="h-5 w-5 text-[#1a1a2e]" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e]">Edit Profile</h1>
          <p className="text-sm text-gray-500">Update your account settings</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-lg p-6 sm:p-8 card-elevated">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name || ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user.email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] transition-colors text-sm"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a1a2e] text-white text-sm font-medium rounded-lg hover:bg-[#2d2d44] transition-colors shadow-sm hover:shadow-md"
            >
              Save Changes
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
