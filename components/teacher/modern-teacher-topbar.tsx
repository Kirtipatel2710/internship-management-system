"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LogOut, User, Settings, Moon, Sun, Bell, Search, Menu, Maximize, Minimize, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [notifications] = useState(3)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const getSectionDescription = (section: string) => {
    const descriptions = {
      overview: "Manage internship requests and applications efficiently",
      "all-nocs": "View and manage all NOC requests from students",
      "pending-nocs": "Review and approve pending NOC requests",
      "approved-nocs": "View all approved NOC requests",
      "rejected-nocs": "View rejected NOC requests and reasons",
      "all-applications": "View and manage all internship applications",
      "pending-applications": "Review and approve pending applications",
      "approved-applications": "View all approved applications",
      "rejected-applications": "View rejected applications and reasons",
      settings: "Manage your profile and preferences",
    }
    return descriptions[section as keyof typeof descriptions] || "Teacher Dashboard"
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
      <div
        className={cn("px-6 py-4 transition-all duration-300", sidebarCollapsed ? "ml-0 lg:ml-16" : "ml-0 lg:ml-80")}
      >
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop Collapse Button */}
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden lg:flex hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {getSectionTitle(activeSection)}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 shadow-sm">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Teacher
                  </Badge>
                  <span className="text-sm text-gray-500 hidden sm:block">{getSectionDescription(activeSection)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students, companies, or requests..."
                className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button (Mobile) */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Fullscreen Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="hidden lg:flex hover:bg-gray-100">
              {isFullscreen ? (
                <Minimize className="h-5 w-5 text-gray-600" />
              ) : (
                <Maximize className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:bg-gray-100">
              {isDarkMode ? <Sun className="h-5 w-5 text-gray-600" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs flex items-center justify-center font-semibold shadow-lg">
                  {notifications > 9 ? "9+" : notifications}
                </div>
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-emerald-500/20 transition-all"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                    <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.name || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold">
                      {userProfile?.name?.charAt(0).toUpperCase() || "T"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.name || ""} />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-semibold">
                        {userProfile?.name?.charAt(0).toUpperCase() || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-none mb-1">{userProfile?.name || "Teacher"}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {userProfile?.email || "teacher@college.edu"}
                      </p>
                      <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs border-0">
                        Teacher
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 p-3">
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Profile</div>
                    <div className="text-xs text-gray-500">Manage your account</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 p-3">
                  <Settings className="mr-3 h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-gray-500">Preferences & privacy</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 hover:bg-red-50 p-3">
                  <LogOut className="mr-3 h-4 w-4" />
                  <div>
                    <div className="font-medium">Log out</div>
                    <div className="text-xs text-red-500">Sign out of your account</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
