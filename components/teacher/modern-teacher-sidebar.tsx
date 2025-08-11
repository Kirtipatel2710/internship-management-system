"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  GraduationCap,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["noc-management", "application-management"])

  const toggleMenu = (menuId: string) => {
    if (collapsed) return
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
      gradient: "from-emerald-500 to-emerald-600",
      submenu: [
        {
          id: "all-nocs",
          label: "All NOCs",
          icon: FileText,
          section: "all-nocs",
          color: "bg-gray-500",
        },
        {
          id: "pending-nocs",
          label: "Pending NOCs",
          icon: Clock,
          section: "pending-nocs",
          color: "bg-orange-500",
        },
        {
          id: "approved-nocs",
          label: "Approved NOCs",
          icon: CheckCircle,
          section: "approved-nocs",
          color: "bg-green-500",
        },
        {
          id: "rejected-nocs",
          label: "Rejected NOCs",
          icon: XCircle,
          section: "rejected-nocs",
          color: "bg-red-500",
        },
      ],
    },
    {
      id: "application-management",
      label: "Application Management",
      icon: Users,
      hasSubmenu: true,
      gradient: "from-purple-500 to-purple-600",
      submenu: [
        {
          id: "all-applications",
          label: "All Applications",
          icon: Users,
          section: "all-applications",
          color: "bg-gray-500",
        },
        {
          id: "pending-applications",
          label: "Pending Applications",
          icon: Clock,
          section: "pending-applications",
          color: "bg-orange-500",
        },
        {
          id: "approved-applications",
          label: "Approved Applications",
          icon: CheckCircle,
          section: "approved-applications",
          color: "bg-green-500",
        },
        {
          id: "rejected-applications",
          label: "Rejected Applications",
          icon: XCircle,
          section: "rejected-applications",
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
      {!collapsed && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setCollapsed(true)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50 transition-all duration-300 ease-in-out",
          collapsed ? "w-0 lg:w-16" : "w-80",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold">Teacher Portal</h2>
                  <p className="text-emerald-100 text-sm">Internship Management</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-white/20 lg:hidden"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-200px)]">
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
                    collapsed && "justify-center px-0",
                  )}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.id)
                    } else {
                      onSectionChange(item.section)
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
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.hasSubmenu && (
                          <div className="transition-transform duration-200">
                            {expandedMenus.includes(item.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Button>

                {/* Submenu */}
                {item.hasSubmenu && expandedMenus.includes(item.id) && !collapsed && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4 py-2">
                    {item.submenu?.map((subItem) => (
                      <Button
                        key={subItem.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-10 text-sm transition-all duration-200 group",
                          activeSection === subItem.section
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                        )}
                        onClick={() => onSectionChange(subItem.section)}
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
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Avatar className="h-12 w-12 ring-2 ring-emerald-200">
                <AvatarImage src={userProfile?.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white font-bold text-lg">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || "T"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userProfile?.name || "Teacher"}</p>
                <p className="text-xs text-gray-500 truncate">Teacher</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
