"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentNavbar } from "@/components/student-navbar"
import { EnhancedOverview } from "@/components/student-dashboard/enhanced-overview"
import { EnhancedOpportunities } from "@/components/student-dashboard/enhanced-opportunities"
import { NOCRequest } from "@/components/student-dashboard/noc-request"
import { WeeklyReports } from "@/components/student-dashboard/weekly-reports"
import { Certificates } from "@/components/student-dashboard/certificates"
import { StatusTracking } from "@/components/student-dashboard/status-tracking"
import { Notifications } from "@/components/student-dashboard/notifications"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const renderContent = () => {
    const contentMap = {
      overview: <EnhancedOverview />,
      opportunities: <EnhancedOpportunities />,
      "noc-request": <NOCRequest />,
      "weekly-reports": <WeeklyReports />,
      certificates: <Certificates />,
      "status-tracking": <StatusTracking />,
      notifications: <Notifications />,
    }

    return contentMap[activeTab as keyof typeof contentMap] || <EnhancedOverview />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-full animate-pulse-glow"></div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">Loading Dashboard</h3>
            <p className="text-gray-600 font-medium">Initializing your workspace...</p>
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 overflow-hidden">
      <div className="flex h-screen w-full">
        {/* Full-Screen Sidebar */}
        <div
          className={`hidden lg:block transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-16" : "w-[280px]"
          } glass-sidebar shadow-modern-lg`}
        >
          <StudentSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content Area with Full-Screen Navbar */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Full-Width Navbar */}
          <div className="glass-nav shadow-modern sticky top-0 z-30">
            <StudentNavbar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          {/* Content Area - Full Screen Utilization */}
          <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
            <div className="w-full h-full min-h-0">
              <div className="p-6 lg:p-8 xl:p-10 w-full">
                <div className="animate-fade-scale w-full max-w-none">{renderContent()}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
