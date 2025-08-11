"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Award,
  Eye,
  TrendingUp,
  Calendar,
  Activity,
  RefreshCw,
} from "lucide-react"
import { getTeacherDashboardStats, getTeacherRecentActivities } from "@/lib/supabase-teacher"
import { toast } from "sonner"

export function TeacherOverview() {
  const [stats, setStats] = useState<any>(null)
  const [recentNocs, setRecentNocs] = useState<any[]>([])
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardStats, recentActivities] = await Promise.all([
        getTeacherDashboardStats(),
        getTeacherRecentActivities(),
      ])

      setStats(dashboardStats)
      setRecentNocs(recentActivities.recentNOCs)
      setRecentApplications(recentActivities.recentApplications)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_teacher":
      case "pending_tpo":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected_teacher":
      case "rejected_tpo":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total NOCs",
      value: stats?.nocs?.total || 0,
      description: "All time requests",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "All requests",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending NOCs",
      value: stats?.nocs?.pending || 0,
      description: "Awaiting your review",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "Need attention",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Approved NOCs",
      value: stats?.nocs?.approved || 0,
      description: "Successfully approved",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "Completed",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Rejected NOCs",
      value: stats?.nocs?.rejected || 0,
      description: "Declined requests",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "Declined",
      gradient: "from-red-500 to-red-600",
    },
    {
      title: "Total Applications",
      value: stats?.applications?.total || 0,
      description: "All applications",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "All time",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Pending Applications",
      value: stats?.applications?.pending || 0,
      description: "Need your review",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "Awaiting",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Approved Applications",
      value: stats?.applications?.approved || 0,
      description: "Successfully approved",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "Approved",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Rejected Applications",
      value: stats?.applications?.rejected || 0,
      description: "Declined applications",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "Declined",
      gradient: "from-red-500 to-red-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                Welcome back, Teacher!
                <Activity className="h-8 w-8 animate-pulse" />
              </h1>
              <p className="text-emerald-100 text-lg mb-4">
                You have{" "}
                <span className="font-bold text-white">
                  {(stats?.nocs?.pending || 0) + (stats?.applications?.pending || 0)} items
                </span>{" "}
                pending your review today.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardData}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Award className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group hover:scale-105"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <p className="text-sm text-gray-500 mb-3">{stat.description}</p>
              <div className="flex items-center text-xs text-gray-600 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent NOC Requests */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Recent NOC Requests
            </CardTitle>
            <CardDescription>Latest NOC requests requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNocs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent NOC requests</p>
              </div>
            ) : (
              recentNocs.map((noc: any) => (
                <div
                  key={noc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{noc.profiles?.name || "Unknown Student"}</p>
                    <p className="text-sm text-gray-500">
                      {noc.company_name} - {noc.internship_role}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(noc.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(noc.status)}
                    <Button variant="ghost" size="sm" className="group-hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <Users className="h-5 w-5 text-white" />
              </div>
              Recent Applications
            </CardTitle>
            <CardDescription>Latest internship applications for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent applications</p>
              </div>
            ) : (
              recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{app.profiles?.name || "Unknown Student"}</p>
                    <p className="text-sm text-gray-500">{app.internship_opportunities?.title || "Unknown Position"}</p>
                    <p className="text-xs text-gray-400">{formatDate(app.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(app.status)}
                    <Button variant="ghost" size="sm" className="group-hover:bg-purple-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
              <Award className="h-5 w-5 text-white" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used actions for efficient workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Review NOCs</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Review Applications</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Approved Items</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <Activity className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
