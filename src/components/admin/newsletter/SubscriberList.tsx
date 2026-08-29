// src/components/admin/newsletter/SubscriberList.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Mail, Check, X, Trash2, Download } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  name?: string | null
  isActive: boolean
  source?: string | null
  subscribedAt: Date
  createdAt: Date
}

interface SubscriberListProps {
  initialSubscribers?: Subscriber[]
  initialTotal?: number
}

export function SubscriberList({ initialSubscribers = [], initialTotal = 0 }: SubscriberListProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")
  const [page, setPage] = useState(1)
  const limit = 20

  // Fetch subscribers - using a separate function that doesn't cause state updates in effect
  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(filter !== "all" && { isActive: filter === "active" ? "true" : "false" }),
      })

      const response = await fetch(`/api/admin/newsletter/subscribers?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSubscribers(data.data || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
    } finally {
      setLoading(false)
    }
  }, [page, search, filter])

  // Load data when dependencies change
  useEffect(() => {
    // Only fetch if we have initial data or if dependencies changed
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubscribers()
  }, [fetchSubscribers])

  // Delete subscriber
  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSubscribers(subscribers.filter((s) => s.id !== id))
        setTotal(total - 1)
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error)
    }
  }

  // Toggle subscriber status
  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        setSubscribers(
          subscribers.map((s) =>
            s.id === id ? { ...s, isActive: !isActive } : s
          )
        )
      }
    } catch (error) {
      console.error("Error updating subscriber:", error)
    }
  }

  // Export subscribers
  const exportSubscribers = () => {
    const csv = [
      ["Email", "Name", "Status", "Source", "Subscribed At"],
      ...subscribers.map((s) => [
        s.email,
        s.name || "",
        s.isActive ? "Active" : "Inactive",
        s.source || "",
        new Date(s.subscribedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Toolbar */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSubscribers}
            className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No subscribers found
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{subscriber.name || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        subscriber.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {subscriber.isActive ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {subscriber.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {subscriber.source || "Website"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(subscriber.id, subscriber.isActive)}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                          subscriber.isActive
                            ? "text-yellow-600 hover:text-yellow-700"
                            : "text-green-600 hover:text-green-700"
                        }`}
                        title={subscriber.isActive ? "Deactivate" : "Activate"}
                      >
                        {subscriber.isActive ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {subscribers.length} of {total} subscribers
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
