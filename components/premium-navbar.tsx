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
  Crown,
  Heart,
} from "lucide-react"
import { useState } from "react"

interface PremiumNavbarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function PremiumNavbar({
  activeSection,
  onSectionChange,
  sidebarCollapsed,
  onToggleSidebar,
}: PremiumNavbarProps) {
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
    <nav className="w-full h-24 px-10 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden lg:flex premium-card hover:bg-electric-gradient hover:text-white transition-all duration-500 w-14 h-14 hover-scale glow-effect"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden premium-card hover:bg-electric-gradient hover:text-white transition-all duration-500 w-14 h-14 hover-scale"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Premium Search Bar */}
        <div className="hidden md:flex items-center relative">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 icon-glow group-hover:text-electric-blue transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search anything magical..."
              className="pl-16 pr-8 py-5 w-[450px] glass-premium rounded-3xl border-2 border-transparent focus:border-electric-blue focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-2xl transition-all duration-500 text-gray-700 placeholder-gray-500 hover:shadow-3xl"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Badge className="badge-electric text-xs animate-pulse-glow">⌘K</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - Dynamic Title */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient animate-bounce-in">{getSectionTitle(activeSection)}</h1>
          <p className="text-lg text-gray-600 font-semibold">Welcome back, D23it176! ✨</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Premium Quick Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Achievement Badge */}
          <div className="flex items-center gap-3 premium-card px-6 py-3 hover-glow-premium interactive-hover">
            <div className="flex items-center justify-center w-10 h-10 bg-golden-gradient rounded-2xl shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-gray-700">Level 5</span>
              <Badge className="badge-golden text-xs ml-2 animate-pulse-glow">+50 XP</Badge>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-3 premium-card px-6 py-3 hover-glow-premium interactive-hover">
            <div className="flex items-center justify-center w-10 h-10 bg-sunset-gradient rounded-2xl shadow-lg">
              <Zap className="h-5 w-5 text-white animate-bounce-in" />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-gray-700">7 Day Streak</span>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-sunset-orange rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="premium-card hover:bg-emerald-gradient hover:text-white transition-all duration-500 w-14 h-14 hover-scale glow-effect"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 icon-emerald" />
            ) : (
              <Maximize2 className="h-5 w-5 icon-emerald" />
            )}
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="premium-card hover:bg-royal-gradient hover:text-white transition-all duration-500 w-14 h-14 hover-rotate glow-effect"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 icon-golden animate-pulse-glow" />
            ) : (
              <Moon className="h-5 w-5 icon-royal animate-float-gentle" />
            )}
          </Button>
        </div>

        {/* Premium Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSectionChange("notification-center")}
          className="premium-card hover:bg-rose-gradient hover:text-white transition-all duration-500 w-14 h-14 relative hover-scale glow-effect"
        >
          <Bell className="h-6 w-6 animate-bounce-in" />
          <Badge className="absolute -top-2 -right-2 bg-rose-pink text-white text-xs px-3 py-2 animate-pulse-glow border-2 border-white shadow-xl">
            5
          </Badge>
        </Button>

        {/* Premium Rewards */}
        <Button
          variant="ghost"
          size="icon"
          className="premium-card hover:bg-cosmic-gradient hover:text-white transition-all duration-500 w-14 h-14 relative hover-rotate glow-effect"
        >
          <Gift className="h-6 w-6 icon-rose animate-float-gentle" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-green rounded-full animate-pulse shadow-lg"></div>
        </Button>

        {/* Premium User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="premium-card hover:bg-electric-gradient hover:text-white transition-all duration-500 h-16 px-6 gap-4 hover-lift-premium glow-effect"
            >
              <Avatar className="h-12 w-12 ring-4 ring-electric-blue/40 ring-offset-4 shadow-2xl">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Student Profile" />
                <AvatarFallback className="bg-electric-gradient text-white font-bold text-xl">D2</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-lg font-bold text-gray-900">D23it176</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Computer Engineering</span>
                  <div className="status-dot status-active"></div>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 animate-bounce-in" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-96 glass-premium border-gray-200/50 rounded-3xl p-6 shadow-2xl"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-0">
              <div className="flex flex-col space-y-6">
                {/* Premium Profile Header */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-electric-blue/40 ring-offset-4 shadow-2xl">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Student Profile" />
                    <AvatarFallback className="bg-electric-gradient text-white font-bold text-2xl">D2</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">D23it176</p>
                    <p className="text-lg text-gray-600 font-medium">Computer Engineering</p>
                    <p className="text-lg font-bold text-electric-blue">6th Semester</p>
                  </div>
                  <Badge className="badge-emerald animate-pulse-glow">
                    <Star className="w-4 h-4 mr-2" />
                    Active
                  </Badge>
                </div>

                {/* Premium Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-electric-gradient rounded-3xl text-white shadow-xl hover-scale">
                    <div className="text-2xl font-bold">8.5</div>
                    <div className="text-sm opacity-90 font-medium">CGPA</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-gradient rounded-3xl text-white shadow-xl hover-scale">
                    <div className="text-2xl font-bold">21CE001</div>
                    <div className="text-sm opacity-90 font-medium">Roll No</div>
                  </div>
                  <div className="text-center p-4 bg-sunset-gradient rounded-3xl text-white shadow-xl hover-scale">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm opacity-90 font-medium">Attendance</div>
                  </div>
                </div>

                {/* Premium Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-bold">Semester Progress</span>
                    <span className="font-bold text-electric-blue">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="progress-electric h-4 rounded-full transition-all duration-1500 ease-out shadow-lg"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">Excellent Progress! 🎉</span>
                    <span className="font-bold">22% remaining</span>
                  </div>
                </div>

                {/* Achievement Showcase */}
                <div className="premium-card bg-cosmic-gradient text-white p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Trophy className="h-8 w-8 text-golden-yellow animate-bounce-in" />
                    <span className="text-xl font-bold">Top Performer</span>
                  </div>
                  <p className="text-white/90 mb-4">You're in the top 5% of your batch!</p>
                  <div className="flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-golden-yellow fill-current animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-6" />
            <DropdownMenuItem className="hover:bg-blue-50 transition-colors duration-300 rounded-2xl p-4 interactive-hover">
              <User className="mr-4 h-6 w-6 icon-electric" />
              <span className="font-bold text-lg">My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-purple-50 transition-colors duration-300 rounded-2xl p-4 interactive-hover">
              <Settings className="mr-4 h-6 w-6 icon-royal" />
              <span className="font-bold text-lg">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-yellow-50 transition-colors duration-300 rounded-2xl p-4 interactive-hover">
              <Trophy className="mr-4 h-6 w-6 icon-golden" />
              <span className="font-bold text-lg">Achievements</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-pink-50 transition-colors duration-300 rounded-2xl p-4 interactive-hover">
              <Heart className="mr-4 h-6 w-6 icon-rose" />
              <span className="font-bold text-lg">Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-6" />
            <DropdownMenuItem className="hover:bg-red-50 text-red-600 transition-colors duration-300 rounded-2xl p-4 interactive-hover">
              <LogOut className="mr-4 h-6 w-6" />
              <span className="font-bold text-lg">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
