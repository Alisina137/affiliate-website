// src/components/analytics/AnalyticsProvider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface AnalyticsContextType {
  trackEvent: (event: {
    type: string
    metadata?: Record<string, any>
  }) => void
  trackPageView: (path: string) => void
  trackAffiliateClick: (affiliateLinkId: string, productId: string) => void
  trackProductView: (productId: string) => void
  trackSearch: (query: string, resultsCount: number) => void
  sessionId: string
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sessionId, setSessionId] = useState("")

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem("analytics_session_id")
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem("analytics_session_id", sid)
    }
    setSessionId(sid)
  }, [])

  useEffect(() => {
    if (pathname && sessionId) {
      trackPageView(pathname)
    }
  }, [pathname, sessionId])

  const trackEvent = async (event: {
    type: string
    metadata?: Record<string, any>
  }) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: event.type,
          sessionId,
          pageUrl: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          metadata: event.metadata,
        }),
      })
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  }

  const trackPageView = (path: string) => {
    trackEvent({
      type: "page_view",
      metadata: { path },
    })
  }

  const trackAffiliateClick = (affiliateLinkId: string, productId: string) => {
    trackEvent({
      type: "affiliate_click",
      metadata: { affiliateLinkId, productId },
    })
  }

  const trackProductView = (productId: string) => {
    trackEvent({
      type: "product_view",
      metadata: { productId },
    })
  }

  const trackSearch = (query: string, resultsCount: number) => {
    trackEvent({
      type: "search",
      metadata: { query, resultsCount },
    })
  }

  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        trackPageView,
        trackAffiliateClick,
        trackProductView,
        trackSearch,
        sessionId,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}
