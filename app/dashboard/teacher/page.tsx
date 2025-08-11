"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { ModernTeacherSidebar } from "@/components/teacher/modern-teacher-sidebar"
import { ModernTeacherTopBar } from "@/components/teacher/modern-teacher-topbar"
import { TeacherOverview } from "@/components/teacher/teacher-overview"
import { NOCManagement } from "@/components/teacher/noc-management"
import { ApplicationManagement } from "@/components/teacher/application-management"
import { TeacherSettings } from "@/components/teacher/teacher-settings"
import { cn } from "@/lib/utils"

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Dev override email for testing
  const DEV_OVERRIDE_EMAIL = "kirteekumarmukeshbhaipatel@gmail.com"

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/error")
      return
    }

    // Check if user has teacher role or is dev override
    const checkAccess = async () => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", session.user?.email)
          .single()

        if (error || !profile) {
          console.error("Profile not found:", error)
          router.push("/auth/error?error=unauthorized")
          return
        }

        // Allow access for teachers or dev override email
        if (profile.role !== "teacher" && session.user?.email !== DEV_OVERRIDE_EMAIL) {
          router.push("/auth/error?error=unauthorized")
          return
        }

        setUserProfile(profile)
        setLoading(false)
      } catch (error) {
        console.error("Access check failed:", error)
        router.push("/auth/error?error=unauthorized")
      }
    }

    checkAccess()
  }, [session, status, router])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <TeacherOverview />
      case "all-nocs":
      case "pending-nocs":
      case "approved-nocs":
      case "rejected-nocs":
        return <NOCManagement activeView={activeSection} />
      case "all-applications":
      case "pending-applications":
      case "approved-applications":
      case "rejected-applications":
        return <ApplicationManagement activeView={activeSection} />
      case "settings":
        return <TeacherSettings userProfile={userProfile} />
      default:
        return <TeacherOverview />
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-800">Loading Teacher Dashboard</p>
            <p className="text-gray-600">Preparing your management portal...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30">
      {/* Sidebar */}
      <ModernTeacherSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userProfile={userProfile}
      />

      {/* Main Content */}
      <div className={cn("transition-all duration-300 ease-in-out", sidebarCollapsed ? "lg:ml-16" : "lg:ml-80")}>
        {/* Top Bar */}
        <ModernTeacherTopBar
          activeSection={activeSection}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          userProfile={userProfile}
        />

        {/* Content Area */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
