"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Loader2 } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        router.push("/") // Redirect to landing if no session
        return
      }

      const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profileError || !currentProfile) {
        console.error("Error fetching profile:", profileError)
        await supabase.auth.signOut()
        router.push("/auth/error?error=ProfileNotFound")
        return
      }

      setProfile(currentProfile)
      setLoading(false)

      // Role-based redirection logic
      const expectedRole = pathname.split("/")[2] // e.g., 'student' from '/dashboard/student'
      if (expectedRole && expectedRole !== currentProfile.role) {
        router.push(`/dashboard/${currentProfile.role}`)
      }
    }

    getSessionAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/") // Redirect to landing if logged out
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!profile) {
    return null // Should not happen due to redirect, but for safety
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getRoleDisplayName(profile.role)} Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {profile.name || profile.email}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || ""} alt={profile.name || profile.email || "User"} />
                    <AvatarFallback>
                      {profile.name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
