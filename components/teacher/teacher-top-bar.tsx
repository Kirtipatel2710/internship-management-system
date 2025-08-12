"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Menu, Bell, Search } from "lucide-react"

interface TeacherTopBarProps {
  activeSection: string
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  userProfile: any
}

export function TeacherTopBar({ activeSection, onToggleSidebar, sidebarCollapsed, userProfile }: TeacherTopBarProps) {
  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return "Dashboard Overview"
      case "all-nocs":
        return "All NOC Requests"
      case "pending-nocs":
        return "Pending NOCs"
      case "approved-nocs":
        return "Approved NOCs"
      case "rejected-nocs":
        return "Rejected NOCs"
      case "all-applications":
        return "All Applications"
      case "pending-applications":
        return "Pending Applications"
      case "approved-applications":
        return "Approved Applications"
      case "rejected-applications":
        return "Rejected Applications"
      case "settings":
        return "Settings"
      default:
        return "Teacher Dashboard"
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">{getSectionTitle()}</h1>
          <p className="text-sm text-gray-500">Welcome back, {userProfile?.name || "Teacher"}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">3</Badge>
        </Button>

        <Button variant="ghost" size="sm">
          <Search className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 ml-2">
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
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{userProfile?.name || "Teacher"}</p>
            <p className="text-xs text-gray-500">Teacher</p>
          </div>
        </div>
      </div>
    </header>
  )
}
