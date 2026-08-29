// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Link2,
  Bot,
  BarChart3,
  Settings,
  Mail,
  Users,
  Star,
  GitCompare,
  BookOpen,
  BarChart,
  Building2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Content",
      href: "#",
      icon: <FileText className="h-5 w-5" />,
      children: [
        {
          label: "Articles",
          href: "/admin/articles",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          label: "Reviews",
          href: "/admin/reviews",
          icon: <Star className="h-4 w-4" />,
        },
        {
          label: "Comparisons",
          href: "/admin/comparisons",
          icon: <GitCompare className="h-4 w-4" />,
        },
        {
          label: "Best Of",
          href: "/admin/best",
          icon: <Star className="h-4 w-4" />,
        },
        {
          label: "Guides",
          href: "/admin/guides",
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: "Statistics",
          href: "/admin/statistics",
          icon: <BarChart className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Products",
      href: "#",
      icon: <Package className="h-5 w-5" />,
      children: [
        {
          label: "Products",
          href: "/admin/products",
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: "Brands",
          href: "/admin/brands",
          icon: <Building2 className="h-4 w-4" />,
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Monetization",
      href: "#",
      icon: <Link2 className="h-5 w-5" />,
      children: [
        {
          label: "Affiliate Links",
          href: "/admin/affiliate-links",
          icon: <Link2 className="h-4 w-4" />,
        },
        {
          label: "Affiliate Programs",
          href: "/admin/affiliate-programs",
          icon: <Link2 className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "AI",
      href: "#",
      icon: <Bot className="h-5 w-5" />,
      children: [
        {
          label: "AI Content Studio",
          href: "/admin/ai-content",
          icon: <Bot className="h-4 w-4" />,
        },
        {
          label: "AI History",
          href: "/admin/ai-history",
          icon: <Bot className="h-4 w-4" />,
        },
        {
          label: "AI Usage",
          href: "/admin/ai-usage",
          icon: <Bot className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Analytics",
      href: "#",
      icon: <BarChart3 className="h-5 w-5" />,
      children: [
        {
          label: "Traffic",
          href: "/admin/analytics/traffic",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          label: "Content Performance",
          href: "/admin/analytics/content",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          label: "Affiliate Performance",
          href: "/admin/analytics/affiliate",
          icon: <BarChart3 className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-5 w-5" />,
      children: [
        {
          label: "General",
          href: "/admin/settings",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          label: "AI Settings",
          href: "/admin/settings/ai",
          icon: <Bot className="h-4 w-4" />,
        },
        {
          label: "Users",
          href: "/admin/settings/users",
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r h-full min-h-screen shrink-0 overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
      </div>

      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const hasChildren = item.children && item.children.length > 0;

          if (hasChildren) {
            return (
              <div key={item.label} className="mb-2">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <div className="ml-6 mt-1 space-y-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive(child.href)
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
