"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, FileText, BookOpen, Settings, LogOut, Clock, CheckCircle, XCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeacherSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  collapsed: boolean
  userProfile: any
}

export function TeacherSidebar({ activeSection, onSectionChange, collapsed, userProfile }: TeacherSidebarProps) {
  const router = useRouter()
  const [isCollapsing, setIsCollapsing] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/auth/signin",
        redirect: true,
      })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "noc-management",
      label: "NOC Management",
      icon: FileText,
      badge: null,
      submenu: [
        { id: "all-nocs", label: "All NOCs", icon: FileText },
        { id: "pending-nocs", label: "Pending", icon: Clock },
        { id: "approved-nocs", label: "Approved", icon: CheckCircle },
        { id: "rejected-nocs", label: "Rejected", icon: XCircle },
      ],
    },
    {
      id: "application-management",
      label: "Applications",
      icon: BookOpen,
      badge: null,
      submenu: [
        { id: "all-applications", label: "All Applications", icon: BookOpen },
        { id: "pending-applications", label: "Pending", icon: Clock },
        { id: "approved-applications", label: "Approved", icon: CheckCircle },
        { id: "rejected-applications", label: "Rejected", icon: XCircle },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
    },
  ]

  const isSubmenuActive = (item: any) => {
    return item.submenu?.some((sub: any) => sub.id === activeSection)
  }

  const renderMenuItem = (item: any, isSubmenu = false) => {
    const isActive = activeSection === item.id || (!isSubmenu && isSubmenuActive(item))
    const Icon = item.icon

    return (
      <button
        key={item.id}
        onClick={() => onSectionChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
          isSubmenu ? "ml-6 text-sm" : "text-sm font-medium",
          isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          collapsed && !isSubmenu && "justify-center px-2",
        )}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isSubmenu && "h-4 w-4")} />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </button>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">Teacher Portal</h2>
              <p className="text-xs text-gray-500 truncate">Management Dashboard</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {userProfile?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{userProfile?.name || "Teacher"}</p>
              <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                {userProfile?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {renderMenuItem(item)}
            {!collapsed && item.submenu && isSubmenuActive(item) && (
              <div className="mt-1 space-y-1">{item.submenu.map((subItem: any) => renderMenuItem(subItem, true))}</div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}
