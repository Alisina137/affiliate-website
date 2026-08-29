// src/components/analytics/EventTracker.tsx
"use client"

import { useEffect, useRef } from "react"
import { useAnalytics } from "./AnalyticsProvider"

interface EventTrackerProps {
  event: string
  metadata?: Record<string, any>
  triggerOn?: "mount" | "click" | "view"
  children?: React.ReactNode
}

export function EventTracker({
  event,
  metadata = {},
  triggerOn = "mount",
  children,
}: EventTrackerProps) {
  const { trackEvent } = useAnalytics()
  const hasTracked = useRef(false)

  useEffect(() => {
    if (triggerOn === "mount" && !hasTracked.current) {
      trackEvent({ type: event, metadata })
      hasTracked.current = true
    }
  }, [event, metadata, triggerOn, trackEvent])

  const handleClick = () => {
    if (triggerOn === "click") {
      trackEvent({ type: event, metadata })
    }
  }

  if (!children) {
    return null
  }

  return (
    <div onClick={handleClick} style={{ cursor: triggerOn === "click" ? "pointer" : "default" }}>
      {children}
    </div>
  )
}
