"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getDashboardStats } from "@/lib/supabase-tp-officer"

interface ModernSidebarProps {
  activeSection: string
  setActiveSection: (section: any) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function ModernSidebar({ activeSection, setActiveSection, isCollapsed, setIsCollapsed }: ModernSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    "noc-management",
    "company-verification",
    "internship-opportunities",
    "application-review",
  ])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMenu = (menuId: string) => {
    if (isCollapsed) return
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]))
  }

  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "overview",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "noc-management",
      label: "NOC Management",
      icon: FileText,
      hasSubmenu: true,
      badge: stats?.nocs?.pending || 0,
      gradient: "from-emerald-500 to-emerald-600",
      submenu: [
        {
          id: "noc-pending",
          label: "Pending NOCs",
          icon: Clock,
          section: "noc-management",
          filter: "pending",
          badge: stats?.nocs?.pending || 0,
          color: "bg-orange-500",
        },
        {
          id: "noc-approved",
          label: "Approved NOCs",
          icon: CheckCircle,
          section: "noc-management",
          filter: "approved",
          badge: stats?.nocs?.approved || 0,
          color: "bg-green-500",
        },
        {
          id: "noc-rejected",
          label: "Rejected NOCs",
          icon: XCircle,
          section: "noc-management",
          filter: "rejected",
          badge: stats?.nocs?.rejected || 0,
          color: "bg-red-500",
        },
      ],
    },
    {
      id: "company-verification",
      label: "Company Verification",
      icon: Building2,
      hasSubmenu: true,
      badge: stats?.companies?.pending || 0,
      gradient: "from-purple-500 to-purple-600",
      submenu: [
        {
          id: "company-pending",
          label: "Pending Companies",
          icon: Clock,
          section: "company-verification",
          filter: "pending",
          badge: stats?.companies?.pending || 0,
          color: "bg-orange-500",
        },
        {
          id: "company-verified",
          label: "Verified Companies",
          icon: CheckCircle,
          section: "company-verification",
          filter: "verified",
          badge: stats?.companies?.verified || 0,
          color: "bg-green-500",
        },
        {
          id: "company-rejected",
          label: "Rejected Companies",
          icon: XCircle,
          section: "company-verification",
          filter: "rejected",
          badge: stats?.companies?.rejected || 0,
          color: "bg-red-500",
        },
      ],
    },
    {
      id: "internship-opportunities",
      label: "Internship Opportunities",
      icon: Briefcase,
      hasSubmenu: true,
      badge: stats?.internships?.active || 0,
      gradient: "from-indigo-500 to-indigo-600",
      submenu: [
        {
          id: "post-internship",
          label: "Post New Internship",
          icon: Plus,
          section: "internship-opportunities",
          filter: "new",
          color: "bg-blue-500",
        },
        {
          id: "active-internships",
          label: "Active Internships",
          icon: Eye,
          section: "internship-opportunities",
          filter: "active",
          badge: stats?.internships?.active || 0,
          color: "bg-green-500",
        },
        {
          id: "closed-internships",
          label: "Closed Internships",
          icon: XCircle,
          section: "internship-opportunities",
          filter: "closed",
          badge: stats?.internships?.closed || 0,
          color: "bg-gray-500",
        },
      ],
    },
    {
      id: "application-review",
      label: "Application Review",
      icon: Users,
      hasSubmenu: true,
      badge: stats?.applications?.pending || 0,
      gradient: "from-rose-500 to-rose-600",
      submenu: [
        {
          id: "app-pending",
          label: "Pending Applications",
          icon: Clock,
          section: "application-review",
          filter: "pending",
          badge: stats?.applications?.pending || 0,
          color: "bg-orange-500",
        },
        {
          id: "app-approved",
          label: "Approved Applications",
          icon: CheckCircle,
          section: "application-review",
          filter: "approved",
          badge: stats?.applications?.approved || 0,
          color: "bg-green-500",
        },
        {
          id: "app-rejected",
          label: "Rejected Applications",
          icon: XCircle,
          section: "application-review",
          filter: "rejected",
          badge: stats?.applications?.rejected || 0,
          color: "bg-red-500",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      section: "settings",
      gradient: "from-gray-500 to-gray-600",
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 lg:w-16" : "w-80",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold">T&P Portal</h2>
                  <p className="text-blue-100 text-sm">Management Dashboard</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-white/20 lg:hidden"
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.id} className="space-y-1">
                {/* Main Menu Item */}
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 text-left font-medium transition-all duration-200 group relative overflow-hidden",
                    activeSection === item.section
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl`
                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900",
                    isCollapsed && "justify-center px-0",
                  )}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.id)
                    } else {
                      setActiveSection(item.section)
                    }
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        activeSection === item.section && "scale-110",
                      )}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        <div className="flex items-center gap-2">
                          {item.badge > 0 && (
                            <Badge
                              className={cn(
                                "text-xs px-2 py-1 font-semibold",
                                activeSection === item.section
                                  ? "bg-white/20 text-white border-white/30"
                                  : "bg-red-500 text-white",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {item.hasSubmenu && (
                            <div className="transition-transform duration-200">
                              {expandedMenus.includes(item.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Button>

                {/* Submenu */}
                {item.hasSubmenu && expandedMenus.includes(item.id) && !isCollapsed && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4 py-2">
                    {item.submenu?.map((subItem) => (
                      <Button
                        key={subItem.id}
                        variant="ghost"
                        className="w-full justify-start h-10 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group"
                        onClick={() => setActiveSection(subItem.section)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-200",
                              subItem.color || "bg-gray-300",
                              "group-hover:scale-125",
                            )}
                          />
                          <subItem.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{subItem.label}</span>
                          {subItem.badge > 0 && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1 font-semibold">
                              {subItem.badge}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer Stats */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-lg font-bold text-blue-600">
                  {(stats?.nocs?.pending || 0) + (stats?.companies?.pending || 0)}
                </div>
                <div className="text-xs text-gray-500">Pending Items</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-lg font-bold text-green-600">{stats?.internships?.active || 0}</div>
                <div className="text-xs text-gray-500">Active Posts</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
