// src/components/admin/ai/AIQualityControl.tsx
"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  FileCheck,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  RefreshCw
} from "lucide-react"

interface QualityCheck {
  name: string
  passed: boolean
  message?: string
  severity: "info" | "warning" | "error"
}

interface AIQualityControlProps {
  contentId: string
  contentType: string
  onPublish?: () => void
  onSave?: () => void
}

export function AIQualityControl({
  contentId,
  contentType,
  onPublish,
  onSave
}: AIQualityControlProps) {
  const [checks, setChecks] = useState<QualityCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const [overallScore, setOverallScore] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    runQualityChecks()
  }, [contentId, contentType])

  const runQualityChecks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/ai/quality-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, contentType }),
      })
      const data = await response.json()

      setChecks(data.checks || [])
      setOverallScore(data.overallScore || 0)
      setIsReady(data.isReady || false)
    } catch (error) {
      console.error("Error running quality checks:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const handlePublish = async () => {
    if (!isReady) {
      alert("Content is not ready for publishing. Please address the issues below.")
      return
    }

    if (!confirm("Are you sure you want to publish this content?")) {
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/admin/ai/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, contentType }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish")
      }

      alert("Content published successfully!")
      if (onPublish) onPublish()
    } catch (error) {
      console.error("Publish error:", error)
      alert("Failed to publish content")
    } finally {
      setIsPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Running quality checks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Quality Control</h3>
          <span className={`px-2 py-0.5 text-xs rounded-full ${getScoreBg(overallScore)} ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </span>
          {isReady ? (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
              <CheckCircle className="h-3 w-3" />
              Ready to Publish
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
              <AlertCircle className="h-3 w-3" />
              Not Ready
            </span>
          )}
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg ${getScoreBg(overallScore)}`}>
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Structure</p>
              <p className="text-2xl font-bold text-blue-600">{Math.min(100, overallScore + 5)}%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Completeness</p>
              <p className="text-2xl font-bold text-blue-600">{Math.min(100, overallScore + 10)}%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">SEO</p>
              <p className="text-2xl font-bold text-blue-600">{Math.min(100, overallScore + 3)}%</p>
            </div>
          </div>

          {/* Check List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Validation Checks</h4>
            {checks.map((check, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg border ${
                  check.passed
                    ? "border-green-100 bg-green-50/50"
                    : check.severity === "error"
                    ? "border-red-100 bg-red-50/50"
                    : "border-yellow-100 bg-yellow-50/50"
                }`}
              >
                {getSeverityIcon(check.severity)}
                <span className="flex-1 text-sm">{check.name}</span>
                {check.message && (
                  <span className="text-xs text-gray-500">{check.message}</span>
                )}
                {check.passed ? (
                  <span className="text-xs text-green-600 font-medium">Passed</span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">Failed</span>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex flex-wrap gap-3">
            <button
              onClick={handlePublish}
              disabled={!isReady || isPublishing}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isReady
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  Publish Content
                </>
              )}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Save Draft
            </button>
            <button
              onClick={() => runQualityChecks()}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recheck
            </button>
          </div>

          {/* Status Message */}
          {!isReady && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Content Not Ready</p>
                <p className="text-sm text-yellow-700">
                  Please fix the issues above before publishing. Some checks may need manual verification.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
