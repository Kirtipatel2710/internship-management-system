"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Home, Search, FileText, Calendar, Award, Activity, Bell, User, Settings, GraduationCap } from "lucide-react"

interface StudentSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function StudentSidebar({ activeTab, setActiveTab }: StudentSidebarProps) {
  const menuItems = [
    {
      id: "overview",
      title: "Overview",
      icon: Home,
      badge: null,
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: Search,
      badge: "12",
    },
    {
      id: "noc-request",
      title: "NOC Request",
      icon: FileText,
      badge: null,
    },
    {
      id: "weekly-reports",
      title: "Weekly Reports",
      icon: Calendar,
      badge: null,
    },
    {
      id: "certificates",
      title: "Certificates",
      icon: Award,
      badge: null,
    },
    {
      id: "status-tracking",
      title: "Status Tracking",
      icon: Activity,
      badge: "3",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      badge: "5",
    },
  ]

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Student Portal</h2>
            <p className="text-sm text-gray-500">Internship Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.id)}
                isActive={activeTab === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
