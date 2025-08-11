"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  Building2,
  Briefcase,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
} from "lucide-react"

interface TPOfficerSidebarProps {
  activeSection: string
  setActiveSection: (section: any) => void
}

export function TPOfficerSidebar({ activeSection, setActiveSection }: TPOfficerSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    "noc-management",
    "company-verification",
    "internship-opportunities",
    "application-review",
  ])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]))
  }

  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "overview",
    },
    {
      id: "noc-management",
      label: "NOC Management",
      icon: FileText,
      hasSubmenu: true,
      badge: "12",
      submenu: [
        {
          id: "noc-pending",
          label: "Pending NOCs",
          icon: Clock,
          section: "noc-management",
          filter: "pending",
          badge: "8",
        },
        {
          id: "noc-approved",
          label: "Approved NOCs",
          icon: CheckCircle,
          section: "noc-management",
          filter: "approved",
          badge: "45",
        },
        {
          id: "noc-rejected",
          label: "Rejected NOCs",
          icon: XCircle,
          section: "noc-management",
          filter: "rejected",
          badge: "3",
        },
      ],
    },
    {
      id: "company-verification",
      label: "Company Verification",
      icon: Building2,
      hasSubmenu: true,
      badge: "5",
      submenu: [
        {
          id: "company-pending",
          label: "Pending Companies",
          icon: Clock,
          section: "company-verification",
          filter: "pending",
          badge: "5",
        },
        {
          id: "company-verified",
          label: "Verified Companies",
          icon: CheckCircle,
          section: "company-verification",
          filter: "verified",
          badge: "28",
        },
        {
          id: "company-rejected",
          label: "Rejected Companies",
          icon: XCircle,
          section: "company-verification",
          filter: "rejected",
          badge: "2",
        },
      ],
    },
    {
      id: "internship-opportunities",
      label: "Internship Opportunities",
      icon: Briefcase,
      hasSubmenu: true,
      badge: "15",
      submenu: [
        {
          id: "post-internship",
          label: "Post New Internship",
          icon: Plus,
          section: "internship-opportunities",
          filter: "new",
        },
        {
          id: "active-internships",
          label: "Active Internships",
          icon: Eye,
          section: "internship-opportunities",
          filter: "active",
          badge: "12",
        },
        {
          id: "closed-internships",
          label: "Closed Internships",
          icon: XCircle,
          section: "internship-opportunities",
          filter: "closed",
          badge: "23",
        },
      ],
    },
    {
      id: "application-review",
      label: "Application Review",
      icon: Users,
      hasSubmenu: true,
      badge: "18",
      submenu: [
        {
          id: "app-pending",
          label: "Pending Applications",
          icon: Clock,
          section: "application-review",
          filter: "pending",
          badge: "18",
        },
        {
          id: "app-approved",
          label: "Approved Applications",
          icon: CheckCircle,
          section: "application-review",
          filter: "approved",
          badge: "67",
        },
        {
          id: "app-rejected",
          label: "Rejected Applications",
          icon: XCircle,
          section: "application-review",
          filter: "rejected",
          badge: "12",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      section: "settings",
    },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">T&P Officer</h2>
            <p className="text-sm text-gray-500">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Main Menu Item */}
            <Button
              variant={activeSection === item.section ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-left font-medium transition-all duration-200 ${
                activeSection === item.section
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                if (item.hasSubmenu) {
                  toggleMenu(item.id)
                } else {
                  setActiveSection(item.section)
                }
              }}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="flex-1">{item.label}</span>
              {item.badge && <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-1">{item.badge}</Badge>}
              {item.hasSubmenu &&
                (expandedMenus.includes(item.id) ? (
                  <ChevronDown className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-2" />
                ))}
            </Button>

            {/* Submenu */}
            {item.hasSubmenu && expandedMenus.includes(item.id) && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                {item.submenu?.map((subItem) => (
                  <Button
                    key={subItem.id}
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setActiveSection(subItem.section)}
                  >
                    <subItem.icon className="h-4 w-4 mr-3" />
                    <span className="flex-1">{subItem.label}</span>
                    {subItem.badge && (
                      <Badge className="ml-2 bg-orange-500 text-white text-xs px-2 py-1">{subItem.badge}</Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
