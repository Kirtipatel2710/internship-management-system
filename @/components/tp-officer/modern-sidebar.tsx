"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, FileText, Users, Settings, Package2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/modern-sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User2, ChevronUp } from "lucide-react"
import { signOut } from "@/lib/supabase"
import { toast } from "@/components/ui/sonner"

export function ModernTpSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error("Sign Out Failed", {
        description: error.message,
      })
    } else {
      toast.success("Signed Out", {
        description: "You have been successfully signed out.",
      })
    }
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard/tp_officer",
      icon: Home,
    },
    {
      title: "Company Verification",
      href: "/dashboard/tp_officer/company-verification",
      icon: Building2,
    },
    {
      title: "Internship Opportunities",
      href: "/dashboard/tp_officer/internship-opportunities",
      icon: Users,
    },
    {
      title: "Application Review",
      href: "/dashboard/tp_officer/application-review",
      icon: FileText,
    },
    {
      title: "NOC Management",
      href: "/dashboard/tp_officer/noc-management",
      icon: FileText,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard/tp_officer" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="group-data-[state=collapsed]:hidden">T&P Officer Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[state=collapsed]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/tp_officer/settings"} tooltip="Settings">
                  <Link href="/dashboard/tp_officer/settings">
                    <Settings />
                    <span className="group-data-[state=collapsed]:hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="User Menu">
                  <User2 />
                  <span className="group-data-[state=collapsed]:hidden">Username</span>
                  {state === "expanded" && <ChevronUp className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
