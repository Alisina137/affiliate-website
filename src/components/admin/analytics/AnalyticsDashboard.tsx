/* eslint-disable react-hooks/set-state-in-effect */
// src/components/admin/analytics/AnalyticsDashboard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  MousePointerClick,
  Package,
  Search as SearchIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface AnalyticsSummary {
  totalEvents: number;
  pageViews: number;
  affiliateClicks: number;
  productViews: number;
  searches: number;
  conversions: number;
  topPages: { url: string; views: number }[];
}

interface DailyStats {
  date: string;
  page_view: number;
  affiliate_click: number;
  product_view: number;
  search: number;
}

interface AffiliatePerformance {
  productId: string;
  clicks: number;
  lastClick: Date;
}

export function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [affiliatePerformance, setAffiliatePerformance] = useState<
    AffiliatePerformance[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("30");

  // Define fetchAnalytics with useCallback to memoize it
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, dailyRes, affiliateRes] = await Promise.all([
        fetch(`/api/admin/analytics/summary?days=${timeRange}`),
        fetch(`/api/admin/analytics/daily?days=${timeRange}`),
        fetch(`/api/admin/analytics/affiliate?days=${timeRange}`),
      ]);

      const summaryData = await summaryRes.json();
      const dailyData = await dailyRes.json();
      const affiliateData = await affiliateRes.json();

      setSummary(summaryData);
      setDailyStats(dailyData);
      setAffiliatePerformance(affiliateData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Now useEffect can safely depend on fetchAnalytics
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Data Available</h3>
        <p className="text-gray-500 mt-1">
          Start tracking analytics to see data here.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Page Views",
      value: summary.pageViews,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-100",
      change: "+12.5%",
      trend: "up",
    },
    {
      label: "Affiliate Clicks",
      value: summary.affiliateClicks,
      icon: MousePointerClick,
      color: "text-green-600",
      bg: "bg-green-100",
      change: "+8.3%",
      trend: "up",
    },
    {
      label: "Product Views",
      value: summary.productViews,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
      change: "+5.7%",
      trend: "up",
    },
    {
      label: "Searches",
      value: summary.searches,
      icon: SearchIcon,
      color: "text-orange-600",
      bg: "bg-orange-100",
      change: "-2.1%",
      trend: "down",
    },
  ];

  const totalEvents = summary.totalEvents || 0;
  const conversionRate =
    summary.pageViews > 0
      ? ((summary.affiliateClicks / summary.pageViews) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTimeRange("7")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === "7"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => setTimeRange("30")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === "30"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          30 Days
        </button>
        <button
          onClick={() => setTimeRange("90")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeRange === "90"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          90 Days
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-400 ml-1">
                vs previous period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold">{conversionRate}%</p>
          <p className="text-sm text-gray-400 mt-1">
            {summary.affiliateClicks} clicks / {summary.pageViews} views
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold">{totalEvents.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">All tracked events</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Top Page</p>
          <p className="text-lg font-bold truncate">
            {summary.topPages[0]?.url || "N/A"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {summary.topPages[0]?.views || 0} views
          </p>
        </div>
      </div>

      {/* Daily Stats Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Daily Activity</h3>
        <div className="h-64">
          {dailyStats.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No daily data available
            </div>
          ) : (
            <div className="h-full flex items-end gap-1">
              {dailyStats.map((day) => {
                const maxValue = Math.max(
                  ...dailyStats.map((d) => d.page_view || 0),
                );
                const height =
                  maxValue > 0 ? (day.page_view / maxValue) * 100 : 0;
                const date = new Date(day.date);
                const label = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-sm hover:bg-blue-600 transition-colors cursor-pointer min-h-1"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-xs text-gray-400">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-4">Top Pages</h3>
          {summary.topPages.length === 0 ? (
            <p className="text-gray-400">No page data available</p>
          ) : (
            <div className="space-y-3">
              {summary.topPages.slice(0, 10).map((page, index) => (
                <div
                  key={page.url}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <span className="text-sm font-medium text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{page.url || "/"}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {page.views}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Affiliate Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-4">Top Affiliate Products</h3>
          {affiliatePerformance.length === 0 ? (
            <p className="text-gray-400">No affiliate data available</p>
          ) : (
            <div className="space-y-3">
              {affiliatePerformance.slice(0, 10).map((item, index) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <span className="text-sm font-medium text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      Product: {item.productId.substring(0, 8)}...
                    </p>
                    <p className="text-xs text-gray-400">
                      Last click:{" "}
                      {new Date(item.lastClick).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {item.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
