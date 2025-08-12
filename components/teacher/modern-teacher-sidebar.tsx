"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  GraduationCap,
  Building2,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface ModernTeacherSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  userProfile: any
}

export function ModernTeacherSidebar({
  activeSection,
  onSectionChange,
  collapsed,
  setCollapsed,
  userProfile,
}: ModernTeacherSidebarProps) {
  const [nocExpanded, setNocExpanded] = useState(true)
  const [applicationExpanded, setApplicationExpanded] = useState(true)
  const [stats, setStats] = useState({
    pendingNocs: 0,
    pendingApplications: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch pending NOCs count
      const { count: nocCount } = await supabase
        .from("noc_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_teacher")

      // Fetch pending applications count
      const { count: appCount } = await supabase
        .from("internship_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_teacher")

      setStats({
        pendingNocs: nocCount || 0,
        pendingApplications: appCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const sidebarItems = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
  ]

  const nocItems = [
    {
      id: "all-nocs",
      label: "All NOCs",
      icon: FileText,
      color: "text-gray-600",
    },
    {
      id: "pending-nocs",
      label: "Pending NOCs",
      icon: Clock,
      color: "text-orange-600",
      badge: stats.pendingNocs,
    },
    {
      id: "approved-nocs",
      label: "Approved NOCs",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: "rejected-nocs",
      label: "Rejected NOCs",
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  const applicationItems = [
    {
      id: "all-applications",
      label: "All Applications",
      icon: Users,
      color: "text-gray-600",
    },
    {
      id: "pending-applications",
      label: "Pending Applications",
      icon: Clock,
      color: "text-orange-600",
      badge: stats.pendingApplications,
    },
    {
      id: "approved-applications",
      label: "Approved Applications",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: "rejected-applications",
      label: "Rejected Applications",
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  const SidebarItem = ({ item, isSubItem = false }: { item: any; isSubItem?: boolean }) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
        isSubItem && "ml-4 pl-8",
        activeSection === item.id
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]"
          : `text-gray-600 hover:text-gray-900 ${item.bgColor || "hover:bg-gray-100"} hover:shadow-md hover:scale-[1.01]`,
        collapsed && !isSubItem && "justify-center px-2",
      )}
      onClick={() => onSectionChange(item.id)}
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
            activeSection === item.id ? "bg-white/20 shadow-sm" : "bg-gray-100 group-hover:bg-white/80",
          )}
        >
          <item.icon
            className={cn(
              "h-4 w-4 transition-all duration-300",
              activeSection === item.id ? "text-white" : `${item.color} group-hover:text-gray-700`,
            )}
          />
        </div>
        {!collapsed && (
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge
                  className={cn(
                    "text-xs px-2 py-0.5 animate-pulse",
                    activeSection === item.id ? "bg-white/20 text-white border-white/30" : "bg-orange-500 text-white",
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Button>
  )

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setCollapsed(true)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white shadow-xl transition-all duration-300 ease-in-out",
          collapsed ? "w-16 lg:w-16" : "w-80 lg:w-80",
          "lg:translate-x-0",
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                {!collapsed && (
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Teacher Portal</h2>
                    <p className="text-xs text-gray-500 font-medium">Internship Management</p>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4 overflow-auto">
            <div className="space-y-2">
              {/* Dashboard Overview */}
              {sidebarItems.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}

              {/* NOC Requests Section */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 group",
                    collapsed && "justify-center px-2",
                  )}
                  onClick={() => !collapsed && setNocExpanded(!nocExpanded)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-all duration-300">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    {!collapsed && (
                      <>
                        <span className="font-semibold text-gray-700 flex-1 text-left">NOC Requests</span>
                        {nocExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </>
                    )}
                  </div>
                </Button>

                {!collapsed && nocExpanded && (
                  <div className="mt-2 space-y-1">
                    {nocItems.map((item) => (
                      <SidebarItem key={item.id} item={item} isSubItem />
                    ))}
                  </div>
                )}
              </div>

              {/* Internship Applications Section */}
              <div className="pt-2">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 group",
                    collapsed && "justify-center px-2",
                  )}
                  onClick={() => !collapsed && setApplicationExpanded(!applicationExpanded)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-all duration-300">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    {!collapsed && (
                      <>
                        <span className="font-semibold text-gray-700 flex-1 text-left">Applications</span>
                        {applicationExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </>
                    )}
                  </div>
                </Button>

                {!collapsed && applicationExpanded && (
                  <div className="mt-2 space-y-1">
                    {applicationItems.map((item) => (
                      <SidebarItem key={item.id} item={item} isSubItem />
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="pt-4">
                <SidebarItem
                  item={{
                    id: "settings",
                    label: "Settings",
                    icon: Settings,
                    color: "text-gray-600",
                    bgColor: "hover:bg-gray-100",
                  }}
                />
              </div>
            </div>
          </div>

          {/* User Profile */}
          {!collapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                  <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                    {userProfile?.name?.charAt(0)?.toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userProfile?.name || "Teacher"}</p>
                  <p className="text-xs text-gray-500 truncate">Teacher</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
