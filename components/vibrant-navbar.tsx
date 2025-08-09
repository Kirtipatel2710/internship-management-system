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
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Maximize2,
  Minimize2,
  Zap,
  Star,
  Trophy,
  Gift,
} from "lucide-react"
import { useState } from "react"

interface VibrantNavbarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function VibrantNavbar({
  activeSection,
  onSectionChange,
  sidebarCollapsed,
  onToggleSidebar,
}: VibrantNavbarProps) {
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

  const getSectionTitle = (section: string) => {
    const titles = {
      overview: "Dashboard Overview",
      opportunities: "Opportunities Hub",
      "noc-center": "NOC Center",
      "reports-manager": "Reports Manager",
      "certificates-gallery": "Certificates Gallery",
      "progress-tracker": "Progress Tracker",
      "notification-center": "Notification Center",
    }
    return titles[section as keyof typeof titles] || "Dashboard"
  }

  return (
    <nav className="w-full h-20 px-8 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden lg:flex vibrant-card hover:bg-electric-gradient hover:text-white transition-all duration-300 w-12 h-12"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden vibrant-card hover:bg-electric-gradient hover:text-white transition-all duration-300 w-12 h-12"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 icon-glow" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-12 pr-6 py-4 w-96 glass-morphism rounded-2xl border-2 border-transparent focus:border-electric-blue focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge className="badge-electric text-xs">⌘K</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Dynamic Title */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient">{getSectionTitle(activeSection)}</h1>
          <p className="text-sm text-gray-600 font-medium">Welcome back, D23it176!</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Achievement Badge */}
          <div className="flex items-center gap-2 vibrant-card px-4 py-2 hover-glow">
            <Trophy className="h-4 w-4 icon-yellow icon-glow" />
            <span className="text-sm font-semibold text-gray-700">Level 5</span>
            <Badge className="badge-yellow text-xs">+50 XP</Badge>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-2 vibrant-card px-4 py-2 hover-glow">
            <Zap className="h-4 w-4 icon-orange icon-glow" />
            <span className="text-sm font-semibold text-gray-700">7 Day Streak</span>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="vibrant-card hover:bg-nature-gradient hover:text-white transition-all duration-300 w-12 h-12"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="vibrant-card hover:bg-royal-gradient hover:text-white transition-all duration-300 w-12 h-12"
          >
            {isDarkMode ? <Sun className="h-4 w-4 icon-yellow" /> : <Moon className="h-4 w-4 icon-purple" />}
          </Button>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSectionChange("notification-center")}
          className="vibrant-card hover:bg-sunset-gradient hover:text-white transition-all duration-300 w-12 h-12 relative"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-2 -right-2 bg-vibrant-pink text-white text-xs px-2 py-1 animate-pulse-glow border-2 border-white">
            5
          </Badge>
        </Button>

        {/* Rewards */}
        <Button
          variant="ghost"
          size="icon"
          className="vibrant-card hover:bg-cosmic-gradient hover:text-white transition-all duration-300 w-12 h-12 relative"
        >
          <Gift className="h-5 w-5 icon-pink" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-electric-green rounded-full animate-pulse"></div>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="vibrant-card hover:bg-electric-gradient hover:text-white transition-all duration-300 h-14 px-4 gap-3"
            >
              <Avatar className="h-10 w-10 ring-4 ring-electric-blue/30 ring-offset-2">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Student Profile" />
                <AvatarFallback className="bg-electric-gradient text-white font-bold text-lg">D2</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-gray-900">D23it176</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Computer Engineering</span>
                  <div className="status-dot status-active"></div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 glass-morphism border-gray-200/50 rounded-3xl p-4"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-0">
              <div className="flex flex-col space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-electric-blue/30 ring-offset-2">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Student Profile" />
                    <AvatarFallback className="bg-electric-gradient text-white font-bold text-xl">D2</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">D23it176</p>
                    <p className="text-sm text-gray-600">Computer Engineering</p>
                    <p className="text-sm font-medium text-electric-blue">6th Semester</p>
                  </div>
                  <Badge className="badge-green">
                    <Star className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-electric-gradient rounded-2xl text-white">
                    <div className="text-xl font-bold">8.5</div>
                    <div className="text-xs opacity-90">CGPA</div>
                  </div>
                  <div className="text-center p-3 bg-nature-gradient rounded-2xl text-white">
                    <div className="text-xl font-bold">21CE001</div>
                    <div className="text-xs opacity-90">Roll No</div>
                  </div>
                  <div className="text-center p-3 bg-sunset-gradient rounded-2xl text-white">
                    <div className="text-xl font-bold">95%</div>
                    <div className="text-xs opacity-90">Attendance</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Semester Progress</span>
                    <span className="font-bold text-electric-blue">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="progress-electric h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-4" />
            <DropdownMenuItem className="hover:bg-blue-50 transition-colors duration-200 rounded-xl p-3">
              <User className="mr-3 h-5 w-5 icon-electric" />
              <span className="font-medium">My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-purple-50 transition-colors duration-200 rounded-xl p-3">
              <Settings className="mr-3 h-5 w-5 icon-purple" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-yellow-50 transition-colors duration-200 rounded-xl p-3">
              <Trophy className="mr-3 h-5 w-5 icon-yellow" />
              <span className="font-medium">Achievements</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-4" />
            <DropdownMenuItem className="hover:bg-red-50 text-red-600 transition-colors duration-200 rounded-xl p-3">
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
