"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Sun, Moon, LogOut, User, Settings, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"

interface ModernTeacherTopBarProps {
  activeSection: string
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  userProfile: any
}

export function ModernTeacherTopBar({
  activeSection,
  onToggleSidebar,
  sidebarCollapsed,
  userProfile,
}: ModernTeacherTopBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getSectionTitle = (section: string) => {
    const titles = {
      overview: "Dashboard Overview",
      "all-nocs": "All NOC Requests",
      "pending-nocs": "Pending NOC Requests",
      "approved-nocs": "Approved NOC Requests",
      "rejected-nocs": "Rejected NOC Requests",
      "all-applications": "All Internship Applications",
      "pending-applications": "Pending Applications",
      "approved-applications": "Approved Applications",
      "rejected-applications": "Rejected Applications",
      settings: "Settings",
    }
    return titles[section as keyof typeof titles] || "Teacher Dashboard"
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h1>
            <p className="text-sm text-gray-500">Manage internship requests and applications</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-gray-100 transition-colors duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                    {userProfile?.name?.charAt(0)?.toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userProfile?.name || "Teacher"}</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile?.name || "Teacher"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
