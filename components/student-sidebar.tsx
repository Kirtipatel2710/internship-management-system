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
  collapsed?: boolean
  onToggleCollapse?: () => void
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
    count: null,
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
    count: "5 New",
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
    count: null,
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
    count: "2 Due",
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
    count: null,
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
    count: null,
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
    count: "3",
  },
]

function SidebarContent({ activeTab, onTabChange, collapsed = false, className }: StudentSidebarProps) {
  return (
    <div className={cn("h-full flex flex-col bg-transparent", className)}>
      {/* Modern Header */}
      <div className="p-6 border-b border-gray-200/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse-glow"></div>
          </div>
          {!collapsed && (
            <div className="animate-fade-scale">
              <h2 className="font-bold text-gray-900 text-xl">IMS</h2>
              <p className="text-xs text-gray-500 font-medium">Internship Management</p>
            </div>
          )}
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
                  "w-full justify-start h-auto rounded-xl transition-all duration-300 group relative overflow-hidden",
                  collapsed ? "p-3" : "p-3",
                  activeTab === item.id
                    ? "bg-gradient-to-r text-white shadow-lg transform scale-[1.02] shadow-colored"
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
                      "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 relative",
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
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.count && (
                          <Badge
                            className={cn(
                              "text-xs px-2 py-0.5",
                              activeTab === item.id
                                ? "bg-white/20 text-white border-white/30"
                                : item.count.includes("New")
                                  ? "bg-blue-500 text-white animate-pulse-glow"
                                  : item.count.includes("Due")
                                    ? "bg-amber-500 text-white animate-pulse-glow"
                                    : "bg-red-500 text-white animate-pulse-glow",
                            )}
                          >
                            {item.count}
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
                  )}
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Modern Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200/30 space-y-4">
          {/* Progress Section */}
          <div className="glass-card rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl shadow-lg">
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
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "78%" }}></div>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 p-3 glass-card rounded-xl border border-gray-200/50 hover-lift">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">D23it176</p>
              <p className="text-xs text-gray-500">Roll No: 21CE001</p>
            </div>
            <div className="status-dot status-approved"></div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-card p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-emerald-600">8.5</div>
              <div className="text-xs text-gray-500">CGPA</div>
            </div>
            <div className="glass-card p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-blue-600">6th</div>
              <div className="text-xs text-gray-500">Semester</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function StudentSidebar({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
}: Omit<StudentSidebarProps, "className">) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <SidebarContent activeTab={activeTab} onTabChange={onTabChange} collapsed={collapsed} />
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
        <SheetContent side="left" className="p-0 w-80 glass-sidebar">
          <SidebarContent
            activeTab={activeTab}
            onTabChange={(tab) => {
              onTabChange(tab)
              setIsOpen(false)
            }}
            collapsed={false}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
