"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, Clock, Bell, Award, BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Stats {
  totalStudents: number
  totalNOCs: number
  pendingNOCs: number
  approvedNOCs: number
  rejectedNOCs: number
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
}

export function TeacherOverview() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalNOCs: 0,
    pendingNOCs: 0,
    approvedNOCs: 0,
    rejectedNOCs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    fetchRecentActivities()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch NOC stats
      const { data: nocs, error: nocError } = await supabase.from("noc_requests").select("status")

      if (nocError) throw nocError

      // Fetch application stats
      const { data: applications, error: appError } = await supabase.from("internship_applications").select("status")

      if (appError) throw appError

      // Fetch student count
      const { data: students, error: studentError } = await supabase.from("profiles").select("id").eq("role", "student")

      if (studentError) throw studentError

      // Calculate stats
      const nocStats = nocs?.reduce(
        (acc, noc) => {
          acc.total++
          if (noc.status === "pending") acc.pending++
          else if (noc.status === "approved") acc.approved++
          else if (noc.status === "rejected") acc.rejected++
          return acc
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 },
      ) || { total: 0, pending: 0, approved: 0, rejected: 0 }

      const appStats = applications?.reduce(
        (acc, app) => {
          acc.total++
          if (app.status === "pending") acc.pending++
          else if (app.status === "approved") acc.approved++
          else if (app.status === "rejected") acc.rejected++
          return acc
        },
        { total: 0, pending: 0, approved: 0, rejected: 0 },
      ) || { total: 0, pending: 0, approved: 0, rejected: 0 }

      setStats({
        totalStudents: students?.length || 0,
        totalNOCs: nocStats.total,
        pendingNOCs: nocStats.pending,
        approvedNOCs: nocStats.approved,
        rejectedNOCs: nocStats.rejected,
        totalApplications: appStats.total,
        pendingApplications: appStats.pending,
        approvedApplications: appStats.approved,
        rejectedApplications: appStats.rejected,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const { data: activities, error } = await supabase
        .from("noc_requests")
        .select(`
          id,
          status,
          created_at,
          profiles!inner(name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error

      setRecentActivities(activities || [])
    } catch (error) {
      console.error("Error fetching recent activities:", error)
    }
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total NOCs",
      value: stats.totalNOCs,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending NOCs",
      value: stats.pendingNOCs,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Teacher Dashboard</h1>
        <p className="text-blue-100">Manage student NOCs and internship applications efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NOC Management Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              NOC Management
            </CardTitle>
            <CardDescription>Overview of NOC requests status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {stats.pendingNOCs}
                </Badge>
              </div>
              <Progress value={(stats.pendingNOCs / Math.max(stats.totalNOCs, 1)) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approved</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {stats.approvedNOCs}
                </Badge>
              </div>
              <Progress value={(stats.approvedNOCs / Math.max(stats.totalNOCs, 1)) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rejected</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {stats.rejectedNOCs}
                </Badge>
              </div>
              <Progress value={(stats.rejectedNOCs / Math.max(stats.totalNOCs, 1)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Application Management Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Application Management
            </CardTitle>
            <CardDescription>Overview of internship applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {stats.pendingApplications}
                </Badge>
              </div>
              <Progress
                value={(stats.pendingApplications / Math.max(stats.totalApplications, 1)) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approved</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {stats.approvedApplications}
                </Badge>
              </div>
              <Progress
                value={(stats.approvedApplications / Math.max(stats.totalApplications, 1)) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rejected</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {stats.rejectedApplications}
                </Badge>
              </div>
              <Progress
                value={(stats.rejectedApplications / Math.max(stats.totalApplications, 1)) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>Latest NOC requests and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">NOC request from {activity.profiles?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      activity.status === "approved"
                        ? "default"
                        : activity.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Clock className="h-6 w-6" />
              <span>Review Pending NOCs</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <BookOpen className="h-6 w-6" />
              <span>Check Applications</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Award className="h-6 w-6" />
              <span>Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
