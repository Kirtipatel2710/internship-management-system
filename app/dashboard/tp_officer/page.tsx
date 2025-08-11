"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { ModernTpSidebar } from "@/components/tp-officer/modern-tp-sidebar"
import { ModernTpTopbar } from "@/components/tp-officer/modern-tp-topbar"
import { TPOfficerOverview } from "@/components/tp-officer/tp-officer-overview"
import { NOCManagement } from "@/components/tp-officer/noc-management"
import { CompanyVerification } from "@/components/tp-officer/company-verification"
import { InternshipOpportunities } from "@/components/tp-officer/internship-opportunities"
import { ApplicationReview } from "@/components/tp-officer/application-review"
import { TPOfficerSettings } from "@/components/tp-officer/tp-officer-settings"
import { getCurrentUser } from "@/lib/supabase-consistent"
import { cn } from "@/lib/utils"

type ActiveSection =
  | "overview"
  | "noc-management"
  | "company-verification"
  | "internship-opportunities"
  | "application-review"
  | "settings"

export default function TPOfficerDashboard() {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview")
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Dev override email for testing
  const DEV_OVERRIDE_EMAIL = "kirteekumarmukeshbhaipatel@gmail.com"

  useEffect(() => {
    async function checkAccess() {
      if (status === "loading") return

      if (!session?.user) {
        redirect("/auth/signin")
        return
      }

      try {
        // Check if user has tp_officer role or is dev override
        const user = await getCurrentUser()

        if (!user) {
          redirect("/auth/error?error=unauthorized")
          return
        }

        const hasAccess = user.role === "tp_officer" || session.user.email === DEV_OVERRIDE_EMAIL

        if (!hasAccess) {
          redirect("/auth/error?error=unauthorized")
          return
        }

        setUserData(user)
      } catch (error) {
        console.error("Error checking access:", error)
        redirect("/auth/error?error=unauthorized")
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [session, status])

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-800">Loading T&P Dashboard</p>
            <p className="text-gray-600">Preparing your management portal...</p>
          </div>
        </div>
      </div>
    )
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <TPOfficerOverview />
      case "noc-management":
        return <NOCManagement />
      case "company-verification":
        return <CompanyVerification />
      case "internship-opportunities":
        return <InternshipOpportunities />
      case "application-review":
        return <ApplicationReview />
      case "settings":
        return <TPOfficerSettings />
      default:
        return <TPOfficerOverview />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return "Dashboard Overview"
      case "noc-management":
        return "NOC Management"
      case "company-verification":
        return "Company Verification"
      case "internship-opportunities":
        return "Internship Opportunities"
      case "application-review":
        return "Application Review"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Sidebar */}
      <ModernTpSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className={cn("transition-all duration-300 ease-in-out", isCollapsed ? "lg:ml-16" : "lg:ml-80")}>
        {/* Top Bar */}
        <ModernTpTopbar
          title={getSectionTitle()}
          userData={userData}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Content Area */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">{renderActiveSection()}</div>
        </main>
      </div>
    </div>
  )
}
