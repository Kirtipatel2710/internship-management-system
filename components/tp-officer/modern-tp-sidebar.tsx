"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  FileText,
  Building2,
  Briefcase,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Award,
  Activity,
} from "lucide-react"

interface ModernTpSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function ModernTpSidebar({
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
}: ModernTpSidebarProps) {
  const menuItems = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: LayoutDashboard,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "noc-management",
      label: "NOC Management",
      icon: FileText,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      id: "company-verification",
      label: "Company Verification",
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "internship-opportunities",
      label: "Internship Opportunities",
      icon: Briefcase,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      id: "application-review",
      label: "Application Review",
      icon: Users,
      gradient: "from-pink-500 to-pink-600",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-gray-500 to-gray-600",
    },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl",
        isCollapsed ? "w-16" : "w-80",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                T&P Officer
              </h2>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-gray-100 p-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 transition-all duration-200",
                  isCollapsed ? "px-3" : "px-4",
                  isActive
                    ? "bg-gradient-to-r text-white shadow-lg hover:shadow-xl"
                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                  isActive && `bg-gradient-to-r ${item.gradient}`,
                )}
                onClick={() => setActiveSection(item.id)}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200",
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5 transition-all duration-200", isActive ? "text-white" : "text-gray-600")}
                  />
                </div>
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </Button>
            )
          })}
        </div>

        {!isCollapsed && (
          <>
            <Separator className="my-6" />

            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 px-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-blue-50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Active Today</p>
                    <p className="text-xs text-gray-500">System running smoothly</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">T&P Portal</p>
              <p className="text-xs text-gray-500">Version 2.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
