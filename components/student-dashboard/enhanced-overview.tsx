"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Upload,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowUpRight,
  Activity,
  BookOpen,
  Target,
  Bell,
} from "lucide-react"

export function EnhancedOverview() {
  const stats = [
    {
      title: "NOC Status",
      value: "0/0",
      subtitle: "Approved requests",
      icon: FileText,
      change: "+1",
      changeType: "positive" as const,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Reports Progress",
      value: "0/0",
      subtitle: "Submitted this month",
      icon: Upload,
      change: "+2",
      changeType: "positive" as const,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Certificates",
      value: "0",
      subtitle: "Earned this semester",
      icon: Award,
      change: "+1",
      changeType: "positive" as const,
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Overall Progress",
      value: "0%",
      subtitle: "Completion rate",
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "Weekly Report #9 Submitted",
      description: "Your weekly report has been successfully submitted for review.",
      time: "2 hours ago",
      type: "report",
      status: "success",
    },
    {
      id: 2,
      title: "NOC Request Approved",
      description: "Your No Objection Certificate request has been approved by the coordinator.",
      time: "1 day ago",
      type: "noc",
      status: "success",
    },
    {
      id: 3,
      title: "Mid-term Evaluation Due",
      description: "Submit your mid-term evaluation report by January 25th.",
      time: "3 days ago",
      type: "deadline",
      status: "warning",
    },
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Weekly Report #9",
      date: "2024-01-20",
      priority: "high",
      type: "report",
    },
    {
      id: 2,
      title: "Mid-term Evaluation",
      date: "2024-01-25",
      priority: "medium",
      type: "evaluation",
    },
    {
      id: 3,
      title: "Final Presentation",
      date: "2024-02-15",
      priority: "low",
      type: "presentation",
    },
  ]

  const quickActions = [
    {
      title: "Submit Weekly Report",
      description: "Upload your latest weekly progress report",
      icon: Upload,
      color: "bg-blue-500",
      action: "weekly-reports",
    },
    {
      title: "Request NOC",
      description: "Apply for No Objection Certificate",
      icon: FileText,
      color: "bg-emerald-500",
      action: "noc-request",
    },
    {
      title: "Browse Opportunities",
      description: "Explore new internship opportunities",
      icon: BookOpen,
      color: "bg-purple-500",
      action: "opportunities",
    },
    {
      title: "Track Status",
      description: "Monitor your application status",
      icon: Activity,
      color: "bg-orange-500",
      action: "status-tracking",
    },
  ]

  return (
    <div className="w-full space-y-8">
      {/* Welcome Header */}
      <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, D23it176!</h1>
                <p className="text-gray-600 text-lg">Track your internship progress and manage your activities</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="badge-success px-4 py-2 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Active Student
              </Badge>
              <Badge className="badge-info px-4 py-2 text-sm font-medium">
                <Target className="w-4 h-4 mr-2" />
                On Track
              </Badge>
            </div>
          </div>
          <div className="flex flex-col lg:items-end space-y-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">Roll Number:</p>
              <p className="text-lg font-semibold text-gray-900">21CE001</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Computer Engineering - 6th Semester</p>
              <p className="text-lg font-semibold text-emerald-600">CGPA: 8.5</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Bell className="w-3 h-3 mr-1" />2 new notifications
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="stat-card hover-glow animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">{stat.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="modern-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                    <p className="text-sm text-gray-600">Your latest submissions and updates</p>
                  </div>
                </div>
                <Badge className="badge-info">Live Updates</Badge>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        activity.status === "success"
                          ? "bg-emerald-100 text-emerald-600"
                          : activity.status === "warning"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {activity.status === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button className="btn-modern w-full">
                  View All Reports
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="modern-card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                  <p className="text-sm text-gray-600">Don't miss these important dates</p>
                </div>
              </div>

              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        deadline.priority === "high"
                          ? "bg-red-400 animate-pulse-glow"
                          : deadline.priority === "medium"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-blue-400"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{deadline.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {deadline.date}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${
                        deadline.priority === "high"
                          ? "badge-error"
                          : deadline.priority === "medium"
                            ? "badge-warning"
                            : "badge-info"
                      }`}
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Progress Overview */}
          <Card className="modern-card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
                  <p className="text-sm text-gray-600">Your journey so far</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Completion</span>
                    <span className="font-semibold text-gray-900">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Reports Submitted</span>
                    <span className="font-semibold text-gray-900">12/15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Attendance</span>
                    <span className="font-semibold text-gray-900">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="modern-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Frequently used features</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                variant="ghost"
                className="h-auto p-4 glass-card hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
