"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  FileText,
  Upload,
  Award,
  BarChart3,
  Bell,
  Menu,
  Home,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react"
import { useState } from "react"

interface StudentSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

const sidebarItems = [
  {
    id: "overview",
    label: "Dashboard",
    icon: Home,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    activeGradient: "from-blue-500 to-blue-600",
    description: "Overview & Analytics",
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    activeGradient: "from-purple-500 to-purple-600",
    description: "Browse Internships",
  },
  {
    id: "noc-request",
    label: "NOC Requests",
    icon: FileText,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    hoverColor: "hover:bg-emerald-100",
    activeGradient: "from-emerald-500 to-emerald-600",
    description: "Certificate Requests",
  },
  {
    id: "weekly-reports",
    label: "Weekly Reports",
    icon: Upload,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
    activeGradient: "from-orange-500 to-orange-600",
    description: "Submit Reports",
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Award,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    hoverColor: "hover:bg-amber-100",
    activeGradient: "from-amber-500 to-amber-600",
    description: "Completion Certs",
  },
  {
    id: "status-tracking",
    label: "Status Tracking",
    icon: BarChart3,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    hoverColor: "hover:bg-indigo-100",
    activeGradient: "from-indigo-500 to-indigo-600",
    description: "Track Progress",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    color: "text-red-600",
    bgColor: "bg-red-50",
    hoverColor: "hover:bg-red-100",
    activeGradient: "from-red-500 to-red-600",
    description: "Updates & Alerts",
    badge: "3",
  },
]

function SidebarContent({ activeTab, onTabChange, className }: StudentSidebarProps) {
  return (
    <div className={cn("h-full flex flex-col bg-transparent", className)}>
      {/* Modern Header */}
      <div className="p-6 border-b border-gray-200/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Student Portal</h2>
            <p className="text-xs text-gray-500 font-medium">Internship Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item, index) => (
            <div key={item.id} className="animate-slide-left" style={{ animationDelay: `${index * 0.05}s` }}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  activeTab === item.id
                    ? "bg-gradient-to-r text-white shadow-lg transform scale-[1.02]"
                    : `text-gray-600 hover:text-gray-900 ${item.hoverColor} hover:shadow-md hover:scale-[1.01]`,
                )}
                style={
                  activeTab === item.id
                    ? {
                        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        "--tw-gradient-from": item.activeGradient.split(" ")[1],
                        "--tw-gradient-to": item.activeGradient.split(" ")[3],
                      }
                    : {}
                }
                onClick={() => onTabChange(item.id)}
              >
                {/* Active indicator */}
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                )}

                <div className="flex items-center gap-3 w-full relative z-10">
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
                      activeTab === item.id ? "bg-white/20 shadow-sm" : "bg-gray-100 group-hover:bg-white/80",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-all duration-300",
                        activeTab === item.id ? "text-white" : `${item.color} group-hover:text-gray-700`,
                      )}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge
                          className={cn(
                            "text-xs px-2 py-0.5 animate-pulse",
                            activeTab === item.id ? "bg-white/20 text-white border-white/30" : "bg-red-500 text-white",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-0.5 transition-colors duration-300",
                        activeTab === item.id ? "text-white/80" : "text-gray-500",
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Modern Footer with Progress */}
      <div className="p-4 border-t border-gray-200/30">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Overall Progress</p>
              <p className="text-xs text-gray-600">Internship Journey</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Completion</span>
              <span className="font-semibold text-blue-600">78%</span>
            </div>
            <div className="bg-white/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out animate-pulse"
                style={{ width: "78%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-4 flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200/50">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500">Student ID: 21CE001</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StudentSidebar({ activeTab, onTabChange }: Omit<StudentSidebarProps, "className">) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <SidebarContent activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden glass-card shadow-modern hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 glass-sidebar">
          <SidebarContent
            activeTab={activeTab}
            onTabChange={(tab) => {
              onTabChange(tab)
              setIsOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
