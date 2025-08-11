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
import { LogOut, User, Settings, Moon, Sun, Bell, Shield } from "lucide-react"

interface TPOfficerTopBarProps {
  title: string
  userData: any
}

export function TPOfficerTopBar({ title, userData }: TPOfficerTopBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications] = useState(7) // Mock notification count

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Implement dark mode toggle logic here
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Title */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  T&P Officer
                </Badge>
                <span className="text-sm text-gray-500">Welcome back, {userData?.name || "Officer"}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="relative h-10 w-10 rounded-full hover:bg-gray-100"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-gray-600" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData?.avatar_url || ""} alt={userData?.name || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {userData?.name?.charAt(0).toUpperCase() || "T"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData?.avatar_url || ""} alt={userData?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {userData?.name?.charAt(0).toUpperCase() || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{userData?.name || "T&P Officer"}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {userData?.email || "officer@college.edu"}
                        </p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200 text-xs">T&P Officer</Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
