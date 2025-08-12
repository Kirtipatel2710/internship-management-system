"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  Shield,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  User,
  Loader2,
  Crown,
  TrendingUp,
  Activity,
  Database,
} from "lucide-react"
import { signOut } from "next-auth/react"

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalTPOfficers: 0,
    totalNOCs: 0,
    totalApplications: 0,
  })

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

        if (!profile || profile.role !== "super_admin") {
          console.error("User is not a super admin or profile not found")
          router.push("/auth/signin")
          return
        }

        setUserProfile(profile)
        await fetchStats()
      } catch (error) {
        console.error("Error in checkAuth:", error)
        router.push("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [session, status, router, mounted])

  const fetchStats = async () => {
    try {
      // Fetch user counts by role
      const { data: profiles } = await supabase.from("profiles").select("role")

      const roleCounts = profiles?.reduce(
        (acc, profile) => {
          acc[profile.role] = (acc[profile.role] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Fetch NOC requests count
      const { count: nocCount } = await supabase.from("noc_requests").select("*", { count: "exact", head: true })

      // Fetch applications count
      const { count: appCount } = await supabase
        .from("internship_applications")
        .select("*", { count: "exact", head: true })

      setStats({
        totalUsers: profiles?.length || 0,
        totalStudents: roleCounts?.student || 0,
        totalTeachers: roleCounts?.teacher || 0,
        totalTPOfficers: roleCounts?.tp_officer || 0,
        totalNOCs: nocCount || 0,
        totalApplications: appCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (!mounted || loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">Access denied. Super Admin account required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Super Administrator
                  </Badge>
                  <span className="text-sm text-gray-500">Welcome back, {userProfile?.name || "Admin"}</span>
                </div>
              </div>
            </div>

            {/* Right Side - User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.name || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                      {userProfile?.name?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                          {userProfile?.name?.charAt(0).toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{userProfile?.name || "Super Admin"}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {userProfile?.email || "admin@college.edu"}
                        </p>
                        <Badge className="mt-2 bg-red-100 text-red-800 border-red-200 text-xs">Super Admin</Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Faculty members</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TP Officers</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalTPOfficers}</div>
              <p className="text-xs text-muted-foreground">Training & Placement officers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NOC Requests</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalNOCs}</div>
              <p className="text-xs text-muted-foreground">Total NOC requests</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <BarChart3 className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">Internship applications</p>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                System Status
              </CardTitle>
              <CardDescription>Current system health and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">File Storage</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Service</span>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Administrative tools and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Database Management
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
