"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { Building2, FileText, Upload, Award, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface DashboardStats {
  totalOpportunities: number
  nocRequests: number
  weeklyReports: number
  certificates: number
  pendingApprovals: number
}

export function Overview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOpportunities: 0,
    nocRequests: 0,
    weeklyReports: 0,
    certificates: 0,
    pendingApprovals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch opportunities count
      const { count: opportunitiesCount } = await supabase
        .from("opportunities")
        .select("*", { count: "exact", head: true })

      // Fetch user's NOC requests count
      const { count: nocCount } = await supabase
        .from("noc_requests")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)

      // Fetch user's weekly reports count
      const { count: reportsCount } = await supabase
        .from("weekly_reports")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)

      // Fetch user's certificates count
      const { count: certificatesCount } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)

      // Fetch pending approvals count
      const { count: pendingCount } = await supabase
        .from("noc_requests")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)
        .eq("status", "pending")

      setStats({
        totalOpportunities: opportunitiesCount || 0,
        nocRequests: nocCount || 0,
        weeklyReports: reportsCount || 0,
        certificates: certificatesCount || 0,
        pendingApprovals: pendingCount || 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to your internship management dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Opportunities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">Internship positions available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NOC Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nocRequests}</div>
            <p className="text-xs text-muted-foreground">Total requests submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyReports}</div>
            <p className="text-xs text-muted-foreground">Reports submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates}</div>
            <p className="text-xs text-muted-foreground">Completion certificates</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</div>
              <Badge variant={stats.pendingApprovals > 0 ? "destructive" : "secondary"}>
                {stats.pendingApprovals > 0 ? "Action Required" : "All Clear"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Submit NOC Request</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Upload className="h-4 w-4 text-green-600" />
              <span className="text-sm">Upload Weekly Report</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Submit Completion Certificate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest submissions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Weekly Report #3 Submitted</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">NOC Request Pending</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Profile Updated</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
