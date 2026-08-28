// src/components/statistics/StatisticContent.tsx
"use client"

import { useState } from "react"
import { Check, Copy, Link2, Download } from "lucide-react"

interface StatisticContentProps {
  statistic: {
    id: string
    content?: string | null
    data: any
    sources: string[]
    methodology?: string | null
    embedCode?: string | null
  }
}

export function StatisticContent({ statistic }: StatisticContentProps) {
  const [copied, setCopied] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)

  // Parse data from JSON
  const parseData = () => {
    if (typeof statistic.data === "string") {
      try {
        return JSON.parse(statistic.data)
      } catch {
        return statistic.data
      }
    }
    return statistic.data
  }

  const data = parseData()

  // Render content with paragraphs
  const renderContent = () => {
    if (!statistic.content) return null

    if (statistic.content.includes("<") || statistic.content.includes(">")) {
      return <div dangerouslySetInnerHTML={{ __html: statistic.content }} />
    }

    const paragraphs = statistic.content.split("\n\n").filter(p => p.trim())
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-700 leading-relaxed mb-4">
        {paragraph}
      </p>
    ))
  }

  // Render statistics data as a table
  const renderDataTable = () => {
    if (!data || typeof data !== "object") return null

    // If it's an array of objects
    if (Array.isArray(data)) {
      if (data.length === 0) return null
      const headers = Object.keys(data[0])
      
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    {header.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="px-4 py-2 text-sm text-gray-600">
                      {row[header] !== undefined ? String(row[header]) : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // If it's a key-value object
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">{key.replace(/_/g, " ").toUpperCase()}</p>
            <p className="text-xl font-bold text-gray-900">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </p>
          </div>
        ))}
      </div>
    )
  }

  // Copy embed code
  const copyEmbedCode = () => {
    if (statistic.embedCode) {
      navigator.clipboard.writeText(statistic.embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="prose prose-sm max-w-none">
          {renderContent()}
        </div>
      </div>

      {/* Data Display */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-bold mb-4">Data Overview</h3>
        {renderDataTable()}
      </div>

      {/* Methodology */}
      {statistic.methodology && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-3">Methodology</h3>
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: statistic.methodology }} />
          </div>
        </div>
      )}

      {/* Sources */}
      {statistic.sources && statistic.sources.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-3">Sources</h3>
          <ul className="space-y-2">
            {statistic.sources.map((source, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400 font-bold">{index + 1}.</span>
                {source.startsWith("http") ? (
                  <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {source}
                  </a>
                ) : (
                  <span>{source}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Embed Section */}
      {statistic.embedCode && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Embed This Content</h3>
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Link2 className="h-4 w-4" />
              {showEmbed ? "Hide Embed Code" : "Show Embed Code"}
            </button>
          </div>

          {showEmbed && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Copy and paste this code into your website to embed these statistics.
              </p>
              <div className="relative">
                <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg text-sm overflow-x-auto">
                  {statistic.embedCode}
                </pre>
                <button
                  onClick={copyEmbedCode}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-300" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600">Copied to clipboard!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
