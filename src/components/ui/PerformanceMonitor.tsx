// src/components/ui/PerformanceMonitor.tsx
"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Report Web Vitals
      const reportWebVitals = (metric: any) => {
        console.log(`Web Vital: ${metric.name} - ${metric.value}`)
        // Send to analytics
        fetch("/api/analytics/web-vitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
          }),
        })
      }

      // @ts-ignore
      if (typeof window.__NEXT_DATA__ !== "undefined") {
        // @ts-ignore
        const webVitals = require("web-vitals")
        webVitals.onCLS(reportWebVitals)
        webVitals.onFID(reportWebVitals)
        webVitals.onFCP(reportWebVitals)
        webVitals.onLCP(reportWebVitals)
        webVitals.onTTFB(reportWebVitals)
      }
    }
  }, [])

  return null
}
