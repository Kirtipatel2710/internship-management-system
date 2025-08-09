"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, Search, Settings, User, LogOut, Moon, Sun, ChevronDown, Maximize2, Minimize2 } from "lucide-react"
import { useState } from "react"

interface StudentNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function StudentNavbar({ activeTab, onTabChange, sidebarCollapsed, onToggleSidebar }: StudentNavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <nav className="w-full h-16 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden lg:flex glass-card hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden glass-card hover:shadow-md transition-all duration-300"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="pl-10 pr-4 py-2 w-80 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Center Section - Page Title */}
      <div className="hidden lg:flex items-center">
        <h1 className="text-xl font-bold text-gray-900 capitalize">
          {activeTab === "overview" ? "Dashboard" : activeTab.replace("-", " ")}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="glass-card hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="glass-card hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTabChange("notifications")}
          className="glass-card hover:shadow-md transition-all duration-300 hover:scale-105 relative"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 animate-pulse-glow">
            3
          </Badge>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="glass-card hover:shadow-md transition-all duration-300 hover:scale-105 h-10 px-3 gap-2"
            >
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Student Profile" />
                <AvatarFallback className="bg-gradient-primary text-white font-semibold text-sm">D2</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">D23it176</span>
                <span className="text-xs text-gray-500">Student</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 glass-card border-gray-200/50" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Student Profile" />
                    <AvatarFallback className="bg-gradient-primary text-white font-bold">D2</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none text-gray-900">D23it176</p>
                    <p className="text-xs leading-none text-gray-500 mt-1">Computer Engineering</p>
                    <p className="text-xs leading-none text-blue-600 mt-1">6th Semester</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Roll Number:</span>
                  <span className="text-xs font-medium text-gray-900">21CE001</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">CGPA:</span>
                  <span className="text-xs font-medium text-green-600">8.5</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-blue-50 transition-colors duration-200">
              <User className="mr-3 h-4 w-4 text-blue-600" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-blue-50 transition-colors duration-200">
              <Settings className="mr-3 h-4 w-4 text-blue-600" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-red-50 text-red-600 transition-colors duration-200">
              <LogOut className="mr-3 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
