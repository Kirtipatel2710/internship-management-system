"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import {
  Building2,
  FileText,
  Upload,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Star,
  Bell,
  Activity,
  Target,
  Zap,
  ArrowRight,
  Eye,
} from "lucide-react"

interface DashboardStats {
  totalOpportunities: number
  nocRequests: number
  weeklyReports: number
  certificates: number
  pendingApprovals: number
  approvedRequests: number
}

interface UserProfile {
  name: string
  email: string
  role: string
  id: string
}

export function EnhancedOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOpportunities: 0,
    nocRequests: 0,
    weeklyReports: 0,
    certificates: 0,
    pendingApprovals: 0,
    approvedRequests: 0,
  })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch all stats in parallel
      const [
        { count: opportunitiesCount },
        { count: nocCount },
        { count: reportsCount },
        { count: certificatesCount },
        { count: pendingCount },
        { count: approvedCount },
      ] = await Promise.all([
        supabase.from("opportunities").select("*", { count: "exact", head: true }),
        supabase.from("noc_requests").select("*", { count: "exact", head: true }).eq("student_id", user.id),
        supabase.from("weekly_reports").select("*", { count: "exact", head: true }).eq("student_id", user.id),
        supabase.from("certificates").select("*", { count: "exact", head: true }).eq("student_id", user.id),
        supabase
          .from("noc_requests")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id)
          .eq("status", "pending"),
        supabase
          .from("noc_requests")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id)
          .eq("status", "approved"),
      ])

      setStats({
        totalOpportunities: opportunitiesCount || 0,
        nocRequests: nocCount || 0,
        weeklyReports: reportsCount || 0,
        certificates: certificatesCount || 0,
        pendingApprovals: pendingCount || 0,
        approvedRequests: approvedCount || 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 w-full">
        {/* Loading Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 animate-shimmer">
          <div className="space-y-4">
            <div className="h-10 bg-white/20 rounded-lg w-1/3 skeleton-loader"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 skeleton-loader"></div>
          </div>
        </div>

        {/* Loading Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="modern-card animate-shimmer">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 skeleton-loader w-3/4"></div>
                  <div className="h-8 skeleton-loader w-1/2"></div>
                  <div className="h-3 skeleton-loader w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full">
      {/* Modern Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-modern-lg animate-slide-up">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg animate-float">
                  <Star className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">!</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-3 animate-slide-left">
                  Welcome back, {profile?.name?.split(" ")[0] || "Student"}! 👋
                </h1>
                <p className="text-blue-100 text-lg lg:text-xl animate-slide-left" style={{ animationDelay: "0.2s" }}>
                  Track your internship journey and achieve your goals
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm animate-fade-scale text-sm">
                <Zap className="h-4 w-4 mr-2" />
                Active Student
              </Badge>
              <Badge
                className="bg-green-500/20 text-white border-green-400/30 px-4 py-2 backdrop-blur-sm animate-fade-scale text-sm"
                style={{ animationDelay: "0.1s" }}
              >
                <Target className="h-4 w-4 mr-2" />
                78% Complete
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 backdrop-blur-sm animate-fade-scale"
                style={{ animationDelay: "0.2s" }}
              >
                <Bell className="h-4 w-4 mr-2" />3 Updates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        {[
          {
            title: "Available Opportunities",
            value: stats.totalOpportunities,
            icon: Building2,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            description: "New positions available",
            trend: "+12%",
            trendUp: true,
          },
          {
            title: "NOC Requests",
            value: `${stats.approvedRequests}/${stats.nocRequests}`,
            icon: FileText,
            gradient: "from-emerald-500 to-green-500",
            bgGradient: "from-emerald-50 to-green-50",
            description: "Approved requests",
            trend: "+5%",
            trendUp: true,
          },
          {
            title: "Weekly Reports",
            value: stats.weeklyReports,
            icon: Upload,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            description: "Reports submitted",
            trend: "+8%",
            trendUp: true,
          },
          {
            title: "Certificates",
            value: stats.certificates,
            icon: Award,
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            description: "Achievements earned",
            trend: "+2%",
            trendUp: true,
          },
        ].map((stat, index) => (
          <Card
            key={stat.title}
            className={`modern-card bg-gradient-to-br ${stat.bgGradient} border-0 animate-slide-up hover-glow`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
              <div
                className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg`}
              >
                <stat.icon className="h-7 w-7 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.description}
                </p>
                <Badge
                  className={`text-xs px-2 py-1 ${
                    stat.trendUp
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3 w-full">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 modern-card border-0 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                Recent Activities
              </CardTitle>
              <CardDescription className="mt-2 text-base text-gray-600">
                Your latest submissions and updates
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 animate-pulse text-sm">
              <Bell className="h-4 w-4 mr-2" />
              Live Updates
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.weeklyReports > 0 || stats.nocRequests > 0 || stats.certificates > 0 ? (
              <>
                {[
                  {
                    title: "Weekly Report #3 Submitted",
                    time: "2 hours ago",
                    status: "Completed",
                    icon: CheckCircle,
                    gradient: "from-green-500 to-emerald-500",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                  },
                  {
                    title: "NOC Request Under Review",
                    time: "1 day ago",
                    status: "Pending",
                    icon: Clock,
                    gradient: "from-orange-500 to-yellow-500",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                  },
                  {
                    title: "Profile Information Updated",
                    time: "3 days ago",
                    status: "Updated",
                    icon: CheckCircle,
                    gradient: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                  },
                ].map((activity, index) => (
                  <div
                    key={activity.title}
                    className={`flex items-center gap-4 p-5 ${activity.bgColor} rounded-2xl border ${activity.borderColor} hover-lift animate-slide-left`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${activity.gradient} rounded-2xl shadow-lg`}
                    >
                      <activity.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-base">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.time}</p>
                    </div>
                    <Badge className="bg-white/80 text-gray-700 border-gray-200 px-3 py-1">{activity.status}</Badge>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16 animate-fade-scale">
                <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6">
                  <Activity className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No recent activities</h3>
                <p className="text-gray-500 mb-6 text-lg">Start by submitting your first NOC request</p>
                <Button className="btn-modern">
                  <FileText className="h-5 w-5 mr-2" />
                  Submit NOC Request
                </Button>
              </div>
            )}

            <Button variant="outline" className="w-full mt-6 btn-outline-modern bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              View All Activities
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Upcoming Deadlines */}
          <Card className="modern-card border-0 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                Upcoming Deadlines
              </CardTitle>
              <CardDescription className="text-gray-600">Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Weekly Report #9",
                  date: "Tomorrow",
                  priority: "High",
                  gradient: "from-red-500 to-pink-500",
                  bgColor: "bg-red-50",
                  borderColor: "border-red-200",
                },
                {
                  title: "Mid-term Evaluation",
                  date: "In 5 days",
                  priority: "Medium",
                  gradient: "from-yellow-500 to-orange-500",
                  bgColor: "bg-yellow-50",
                  borderColor: "border-yellow-200",
                },
              ].map((deadline, index) => (
                <div
                  key={deadline.title}
                  className={`flex items-center gap-3 p-4 ${deadline.bgColor} rounded-2xl border ${deadline.borderColor} hover-lift animate-slide-left`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${deadline.gradient} rounded-2xl shadow-lg`}
                  >
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{deadline.title}</p>
                    <p className="text-sm text-gray-600 mt-1">📅 {deadline.date}</p>
                  </div>
                  <Badge
                    variant={deadline.priority === "High" ? "destructive" : "secondary"}
                    className="text-xs px-2 py-1"
                  >
                    {deadline.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="modern-card border-0 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-600">Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Submit NOC",
                    icon: FileText,
                    gradient: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                  },
                  {
                    title: "Upload Report",
                    icon: Upload,
                    gradient: "from-emerald-500 to-green-500",
                    bgColor: "bg-emerald-50",
                    borderColor: "border-emerald-200",
                  },
                  {
                    title: "Add Certificate",
                    icon: Award,
                    gradient: "from-orange-500 to-red-500",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                  },
                  {
                    title: "Browse Jobs",
                    icon: Building2,
                    gradient: "from-purple-500 to-pink-500",
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-200",
                  },
                ].map((action, index) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`h-28 flex-col space-y-3 ${action.bgColor} ${action.borderColor} hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-scale`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-2xl shadow-lg`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
