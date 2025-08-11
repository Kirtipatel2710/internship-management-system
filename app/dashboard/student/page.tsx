"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
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

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-800">Loading Dashboard</p>
            <p className="text-gray-600">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="flex h-screen w-full">
        {/* Optimized Sidebar - Reduced Width */}
        <div className="hidden lg:block w-60 glass-sidebar shadow-modern">
          <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Content Area - Full Width Utilization */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50/50 to-white/50">
          {/* Mobile Header */}
          <div className="lg:hidden glass-card border-b border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Content Area - No Right Margins, Full Utilization */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="w-full h-full">
              <div className="p-6 lg:p-8 w-full">
                <div className="animate-fade-scale w-full">{renderContent()}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}