"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "@/lib/auth" // Import signOut from your auth config
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { ModernTeacherSidebar } from "@/components/teacher/modern-teacher-sidebar"
import { ModernTpSidebar } from "@/components/tp-officer/modern-tp-sidebar"
import { StudentNavbar } from "@/components/student-navbar"
import { ModernTeacherTopbar } from "@/components/teacher/modern-teacher-topbar"
import { ModernTpTopbar } from "@/components/tp-officer/modern-tp-topbar"
import { PremiumNavbar } from "@/components/premium-navbar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "student" | "teacher" | "tp_officer" | "super_admin"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const renderSidebar = () => {
    switch (userRole) {
      case "student":
        return <StudentSidebar />
      case "teacher":
        return <ModernTeacherSidebar />
      case "tp_officer":
        return <ModernTpSidebar />
      case "super_admin":
        // Super admin can use a generic sidebar or a specific one if needed
        return (
          <Sidebar>
            <SidebarHeader>
              <h3 className="text-lg font-semibold">Admin Panel</h3>
            </SidebarHeader>
            <SidebarContent>
              {/* Add admin specific navigation here */}
              <p className="p-2 text-sm text-muted-foreground">Admin links coming soon...</p>
            </SidebarContent>
            <SidebarFooter>{/* Admin footer content */}</SidebarFooter>
          </Sidebar>
        )
      default:
        return null
    }
  }

  const renderNavbar = () => {
    switch (userRole) {
      case "student":
        return <StudentNavbar />
      case "teacher":
        return <ModernTeacherTopbar />
      case "tp_officer":
        return <ModernTpTopbar />
      case "super_admin":
        return <PremiumNavbar /> // Using PremiumNavbar for super admin
      default:
        return null
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "student":
        return "Student"
      case "teacher":
        return "Teacher"
      case "tp_officer":
        return "T&P Officer"
      case "super_admin":
        return "Super Admin"
      default:
        return "User"
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {renderSidebar()}
        <div className="flex flex-1 flex-col">
          {renderNavbar()}
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
