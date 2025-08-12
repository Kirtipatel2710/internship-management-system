"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { TPOfficerSidebar } from "@/components/tp-officer/tp-officer-sidebar"
import { TPOfficerTopBar } from "@/components/tp-officer/tp-officer-topbar"
import { TPOfficerOverview } from "@/components/tp-officer/tp-officer-overview"
import { NOCManagement } from "@/components/tp-officer/noc-management"
import { CompanyVerification } from "@/components/tp-officer/company-verification"
import { InternshipOpportunities } from "@/components/tp-officer/internship-opportunities"
import { ApplicationReview } from "@/components/tp-officer/application-review"
import { TPOfficerSettings } from "@/components/tp-officer/tp-officer-settings"
import { Loader2 } from "lucide-react"

export default function TPOfficerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
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

        if (!profile || profile.role !== "tp_officer") {
          console.error("User is not a TP officer or profile not found")
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

  if (!mounted || loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading TP Officer dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">Access denied. TP Officer account required.</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
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
        return <TPOfficerSettings userData={userProfile} />
      default:
        return <TPOfficerOverview />
    }
  }

  const getSectionTitle = () => {
    const titles = {
      overview: "Dashboard Overview",
      "noc-management": "NOC Management",
      "company-verification": "Company Verification",
      "internship-opportunities": "Internship Opportunities",
      "application-review": "Application Review",
      settings: "Settings",
    }
    return titles[activeSection as keyof typeof titles] || "TP Officer Dashboard"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <TPOfficerSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Top Bar */}
          <TPOfficerTopBar title={getSectionTitle()} userData={userProfile} />

          {/* Content */}
          <main className="p-8">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
