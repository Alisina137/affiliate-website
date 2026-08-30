// src/components/home/NewsletterSignup.tsx
"use client"

import { useState } from "react"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "homepage" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setStatus("success")
      setMessage(data.message || "Successfully subscribed!")
      setEmail("")
      setName("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An error occurred. Please try again.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto text-center px-4 sm:px-0">
      <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-4">
        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
        <span className="text-xs sm:text-sm text-white/60">Stay in the loop</span>
      </div>

      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
        Get the best products delivered
      </h3>
      <p className="text-sm sm:text-base text-white/60 mb-5 sm:mb-6 max-w-lg mx-auto leading-relaxed px-2">
        Subscribe to receive our latest reviews, comparisons, and buying guides.
        No spam. Unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="flex-1 px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm sm:text-base min-h-[48px]"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="flex-1 px-3 sm:px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm sm:text-base min-h-[48px]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 sm:px-6 py-3 bg-white text-[#1a1a2e] font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px] min-w-[100px]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Subscribing...</span>
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>

        {status === "success" && (
          <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 rounded-lg px-3 sm:px-4 py-2 max-w-xl mx-auto text-sm">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 rounded-lg px-3 sm:px-4 py-2 max-w-xl mx-auto text-sm">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{message}</span>
          </div>
        )}

        <p className="text-xs text-white/30">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  )
}
