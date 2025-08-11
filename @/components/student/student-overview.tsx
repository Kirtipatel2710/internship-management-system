"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { FileText, Search, Calendar, Award, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function StudentOverview() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalOpportunities: 0,
    nocRequests: 0,
    weeklyReports: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Fetch application stats
        const { data: applications } = await supabase
          .from("internship_applications")
          .select("status")
          .eq("student_id", user.id)

        // Fetch NOC requests
        const { data: nocRequests } = await supabase.from("noc_requests").select("id").eq("student_id", user.id)

        // Fetch weekly reports
        const { data: weeklyReports } = await supabase.from("weekly_reports").select("id").eq("student_id", user.id)

        // Fetch total opportunities
        const { data: opportunities } = await supabase
          .from("internship_opportunities")
          .select("id")
          .eq("status", "active")

        const totalApplications = applications?.length || 0
        const pendingApplications =
          applications?.filter((app) => app.status === "pending_teacher" || app.status === "pending_tpo").length || 0
        const approvedApplications = applications?.filter((app) => app.status === "approved").length || 0

        setStats({
          totalApplications,
          pendingApplications,
          approvedApplications,
          totalOpportunities: opportunities?.length || 0,
          nocRequests: nocRequests?.length || 0,
          weeklyReports: weeklyReports?.length || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const quickActions = [
    {
      title: "Browse Opportunities",
      description: "Find new internship opportunities",
      icon: Search,
      color: "bg-blue-500",
      action: "opportunities",
    },
    {
      title: "Submit NOC Request",
      description: "Request No Objection Certificate",
      icon: FileText,
      color: "bg-green-500",
      action: "noc-request",
    },
    {
      title: "Weekly Report",
      description: "Submit your weekly progress",
      icon: Calendar,
      color: "bg-purple-500",
      action: "weekly-reports",
    },
    {
      title: "View Certificates",
      description: "Download your certificates",
      icon: Award,
      color: "bg-orange-500",
      action: "certificates",
    },
  ]

  const recentActivity = [
    {
      title: "Application Approved",
      description: "Your application for Software Developer Intern at TechCorp was approved",
      time: "2 hours ago",
      type: "success",
    },
    {
      title: "NOC Request Pending",
      description: "Your NOC request is pending teacher approval",
      time: "1 day ago",
      type: "warning",
    },
    {
      title: "Weekly Report Due",
      description: "Week 3 report is due tomorrow",
      time: "2 days ago",
      type: "info",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-blue-100">
          Track your internship applications, manage NOC requests, and stay updated with your progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingApplications} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Opportunities</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">Active internship positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NOC Requests</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nocRequests}</div>
            <p className="text-xs text-muted-foreground">Submitted requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyReports}</div>
            <p className="text-xs text-muted-foreground">Reports submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
          <CardDescription>Your internship application journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Applications Submitted</span>
              <span>{stats.totalApplications}</span>
            </div>
            <Progress value={(stats.totalApplications / Math.max(stats.totalOpportunities, 1)) * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Approval Rate</span>
              <span>
                {stats.totalApplications > 0
                  ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                  : 0}
                %
              </span>
            </div>
            <Progress
              value={stats.totalApplications > 0 ? (stats.approvedApplications / stats.totalApplications) * 100 : 0}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`p-1 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-100"
                      : activity.type === "warning"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                  }`}
                >
                  {activity.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activity.type === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                  {activity.type === "info" && <Clock className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
