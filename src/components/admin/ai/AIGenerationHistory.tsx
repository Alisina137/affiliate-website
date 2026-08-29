// src/components/admin/ai/AIGenerationHistory.tsx
"use client"

import { useState, useEffect } from "react"
import { 
  FileText, 
  Star, 
  GitCompare, 
  BookOpen, 
  BarChart,
  Package,
  Tag,
  Building2,
  ListChecks,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  RotateCcw,
  Calendar,
  Bot
} from "lucide-react"

interface Generation {
  id: string
  contentType: string
  operation: string
  status: "PENDING" | "SUCCESS" | "FAILED" | "PARTIAL"
  model: string
  inputTokens: number | null
  outputTokens: number | null
  estimatedCost: number | null
  duration: number | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
  contentId?: string | null
  output?: any
  error?: string | null
}

interface AIGenerationHistoryProps {
  contentId?: string
  contentType?: string
}

export function AIGenerationHistory({ contentId, contentType }: AIGenerationHistoryProps) {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null)
  const [totalCost, setTotalCost] = useState(0)
  const [totalGenerations, setTotalGenerations] = useState(0)

  useEffect(() => {
    fetchHistory()
  }, [contentId, contentType])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (contentId) params.set("contentId", contentId)
      if (contentType) params.set("contentType", contentType)
      params.set("limit", "50")

      const response = await fetch(`/api/admin/ai/generations?${params.toString()}`)
      const data = await response.json()

      setGenerations(data.data || [])
      setTotalGenerations(data.total || 0)
      setTotalCost(data.totalCost || 0)
    } catch (error) {
      console.error("Error fetching generations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRollback = async (generation: Generation) => {
    if (!generation.contentId || !generation.output) {
      alert("This generation has no content to rollback to")
      return
    }

    if (!confirm(`Rollback to version from ${new Date(generation.createdAt).toLocaleString()}?`)) {
      return
    }

    try {
      const response = await fetch("/api/admin/ai/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId: generation.id,
          contentId: generation.contentId,
          contentType: generation.contentType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to rollback")
      }

      alert("Successfully rolled back!")
      fetchHistory()
    } catch (error) {
      console.error("Rollback error:", error)
      alert("Failed to rollback")
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "REVIEW": return <Star className="h-4 w-4" />
      case "COMPARISON": return <GitCompare className="h-4 w-4" />
      case "BEST_OF": return <ListChecks className="h-4 w-4" />
      case "GUIDE": return <BookOpen className="h-4 w-4" />
      case "STATISTICS": return <BarChart className="h-4 w-4" />
      case "PRODUCT": return <Package className="h-4 w-4" />
      case "CATEGORY": return <Tag className="h-4 w-4" />
      case "BRAND": return <Building2 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"><CheckCircle className="h-3 w-3" /> Success</span>
      case "FAILED":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full"><XCircle className="h-3 w-3" /> Failed</span>
      case "PARTIAL":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">Partial</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"><Loader2 className="h-3 w-3 animate-spin" /> Pending</span>
    }
  }

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(6)}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No AI Generations Found</h3>
        <p className="text-gray-500 mt-1">AI generations will appear here once you start using the AI Content Studio.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Generations</p>
          <p className="text-2xl font-bold">{totalGenerations}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold text-blue-600">{formatCost(totalCost)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {generations.length > 0
              ? `${Math.round((generations.filter(g => g.status === "SUCCESS").length / generations.length) * 100)}%`
              : "0%"}
          </p>
        </div>
      </div>

      {/* Generation List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {generations.map((gen) => (
                <tr key={gen.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {gen.contentId ? `Content ${gen.contentId.substring(0, 8)}` : "New"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(gen.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm">
                      {getContentTypeIcon(gen.contentType)}
                      {gen.contentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {gen.model}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {gen.inputTokens || 0} / {gen.outputTokens || 0}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {gen.estimatedCost ? formatCost(gen.estimatedCost) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(gen.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedGeneration(selectedGeneration?.id === gen.id ? null : gen)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {gen.status === "SUCCESS" && gen.contentId && (
                        <button
                          onClick={() => handleRollback(gen)}
                          className="p-1 text-gray-400 hover:text-orange-600 rounded transition-colors"
                          title="Rollback"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generation Details Modal */}
      {selectedGeneration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Generation Details</h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedGeneration.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedGeneration(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Content Type</p>
                  <p className="font-medium">{selectedGeneration.contentType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Operation</p>
                  <p className="font-medium">{selectedGeneration.operation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="font-medium">{selectedGeneration.model}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p>{getStatusBadge(selectedGeneration.status)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Input</p>
                <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-32">
                  {JSON.stringify(selectedGeneration.output?.input || {}, null, 2)}
                </pre>
              </div>
              {selectedGeneration.output && (
                <div>
                  <p className="text-xs text-gray-500">Output Preview</p>
                  <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedGeneration.output, null, 2).substring(0, 500)}
                    {JSON.stringify(selectedGeneration.output, null, 2).length > 500 && "..."}
                  </pre>
                </div>
              )}
              {selectedGeneration.error && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">Error</p>
                  <p className="text-sm text-red-600">{selectedGeneration.error}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <button
                onClick={() => setSelectedGeneration(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedGeneration.status === "SUCCESS" && selectedGeneration.contentId && (
                <button
                  onClick={() => {
                    handleRollback(selectedGeneration)
                    setSelectedGeneration(null)
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Rollback
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
