"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"
import { TeacherTopBar } from "@/components/teacher/teacher-top-bar"
import { TeacherOverview } from "@/components/teacher/teacher-overview"
import { NOCManagement } from "@/components/teacher/noc-management"
import { ApplicationManagement } from "@/components/teacher/application-management"
import { TeacherSettings } from "@/components/teacher/teacher-settings"
import { Loader2 } from "lucide-react"

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      if (status === "loading") return

      if (status === "unauthenticated") {
        router.push("/auth/signin")
        return
      }

      if (!session?.user?.email) {
        router.push("/auth/signin")
        return
      }

      try {
        // Fetch user profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          router.push("/auth/signin")
          return
        }

        if (!profile || profile.role !== "teacher") {
          console.error("User is not a teacher or profile not found")
          router.push("/auth/signin")
          return
        }

        setUserProfile(profile)
      } catch (error) {
        console.error("Error in checkAuth:", error)
        router.push("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [session, status, router, mounted])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (!mounted || loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">Access denied. Teacher account required.</p>
        </div>
      </div>
    )
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
        return <TeacherSettings />
      default:
        return <TeacherOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-20" : "w-64"
          } transition-all duration-300 ease-in-out bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 h-full z-40`}
        >
          <TeacherSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            collapsed={sidebarCollapsed}
            userProfile={userProfile}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${sidebarCollapsed ? "ml-20" : "ml-64"} transition-all duration-300 ease-in-out`}>
          {/* Top Bar */}
          <TeacherTopBar
            activeSection={activeSection}
            onToggleSidebar={toggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
            userProfile={userProfile}
          />

          {/* Content */}
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
