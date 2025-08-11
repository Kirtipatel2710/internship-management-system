"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/student-sidebar"
import { EnhancedOverview } from "@/components/student-dashboard/enhanced-overview"
import { EnhancedOpportunities } from "@/components/student-dashboard/enhanced-opportunities"
import { NOCRequest } from "@/components/student-dashboard/noc-request"
import { WeeklyReports } from "@/components/student-dashboard/weekly-reports"
import { Certificates } from "@/components/student-dashboard/certificates"
import { StatusTracking } from "@/components/student-dashboard/status-tracking"
import { Notifications } from "@/components/student-dashboard/notifications"
import { getCurrentUser } from "@/lib/supabase"
import { toast } from "sonner"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const { user, profile, error } = await getCurrentUser()

      if (error || !user) {
        toast.error("Authentication Required", {
          description: "Please sign in to access the dashboard",
        })
        router.push("/auth/signin")
        return
      }

      if (profile?.role !== "student") {
        toast.error("Access Denied", {
          description: "This dashboard is only accessible to students",
        })
        router.push("/")
        return
      }

      setUserProfile(profile)
      setIsAuthenticated(true)
      toast.success("Welcome back!", {
        description: `Hello ${profile?.name || user.email}`,
      })
    } catch (error) {
      console.error("Authentication check failed:", error)
      toast.error("Authentication Error", {
        description: "Failed to verify your credentials",
      })
      router.push("/auth/signin")
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    const contentMap = {
      overview: <EnhancedOverview userProfile={userProfile} />,
      opportunities: <EnhancedOpportunities onTabChange={setActiveTab} />,
      "noc-request": <NOCRequest />,
      "weekly-reports": <WeeklyReports />,
      certificates: <Certificates />,
      "status-tracking": <StatusTracking />,
      notifications: <Notifications />,
    }

    return contentMap[activeTab as keyof typeof contentMap] || <EnhancedOverview userProfile={userProfile} />
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

  if (!isAuthenticated) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="flex h-screen w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-60 glass-sidebar shadow-modern">
          <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} userProfile={userProfile} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50/50 to-white/50">
          {/* Mobile Header */}
          <div className="lg:hidden glass-card border-b border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} userProfile={userProfile} />
              <h1 className="text-lg font-semibold text-gray-900">Student Dashboard</h1>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Content Area */}
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
