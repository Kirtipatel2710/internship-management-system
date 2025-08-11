"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
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
  Trophy,
  Eye,
  Heart,
  Sparkles,
  Crown,
  Diamond,
  Flame,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function DashboardOverview() {
  const stats = [
    {
      title: "Active Applications",
      value: "8",
      subtitle: "In progress",
      icon: Briefcase,
      change: "+3 this week",
      changeType: "positive" as const,
      gradient: "bg-electric-gradient",
      iconColor: "icon-electric",
    },
    {
      title: "Reports Submitted",
      value: "12",
      subtitle: "This semester",
      icon: Upload,
      change: "+2 this week",
      changeType: "positive" as const,
      gradient: "bg-emerald-gradient",
      iconColor: "icon-emerald",
    },
    {
      title: "Certificates Earned",
      value: "5",
      subtitle: "Total achievements",
      icon: Award,
      change: "+1 this month",
      changeType: "positive" as const,
      gradient: "bg-sunset-gradient",
      iconColor: "icon-sunset",
    },
    {
      title: "Overall Progress",
      value: "78%",
      subtitle: "Semester completion",
      icon: TrendingUp,
      change: "+12% this month",
      changeType: "positive" as const,
      gradient: "bg-royal-gradient",
      iconColor: "icon-royal",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "Weekly Report #12 Submitted",
      description: "Successfully submitted your weekly progress report with detailed project updates and achievements.",
      time: "2 hours ago",
      type: "report",
      status: "success",
      icon: CheckCircle,
      gradient: "bg-emerald-gradient",
    },
    {
      id: 2,
      title: "NOC Request Approved",
      description: "Your No Objection Certificate for TechCorp internship has been approved by the coordinator.",
      time: "1 day ago",
      type: "noc",
      status: "success",
      icon: CheckCircle,
      gradient: "bg-electric-gradient",
    },
    {
      id: 3,
      title: "New Opportunity Available",
      description: "A premium software development internship opportunity perfectly matches your profile and skills.",
      time: "2 days ago",
      type: "opportunity",
      status: "info",
      icon: Briefcase,
      gradient: "bg-sunset-gradient",
    },
    {
      id: 4,
      title: "Certificate Verification Complete",
      description: "Your internship completion certificate has been verified and added to your premium portfolio.",
      time: "3 days ago",
      type: "certificate",
      status: "success",
      icon: Award,
      gradient: "bg-cosmic-gradient",
    },
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Weekly Report #13",
      date: "Tomorrow",
      priority: "high",
      type: "report",
      icon: Upload,
      gradient: "bg-sunset-gradient",
    },
    {
      id: 2,
      title: "Mid-term Evaluation",
      date: "In 3 days",
      priority: "medium",
      type: "evaluation",
      icon: FileText,
      gradient: "bg-royal-gradient",
    },
    {
      id: 3,
      title: "Project Presentation",
      date: "Next week",
      priority: "low",
      type: "presentation",
      icon: BookOpen,
      gradient: "bg-emerald-gradient",
    },
  ]

  const quickActions = [
    {
      title: "Submit Report",
      description: "Upload weekly progress",
      icon: Upload,
      gradient: "bg-electric-gradient",
      action: "reports-manager",
    },
    {
      title: "Browse Jobs",
      description: "Find new opportunities",
      icon: Briefcase,
      gradient: "bg-sunset-gradient",
      action: "opportunities",
    },
    {
      title: "Request NOC",
      description: "Apply for certificate",
      icon: FileText,
      gradient: "bg-emerald-gradient",
      action: "noc-center",
    },
    {
      title: "Track Progress",
      description: "View your journey",
      icon: TrendingUp,
      gradient: "bg-royal-gradient",
      action: "progress-tracker",
    },
  ]

  return (
    <div className="w-full space-y-10">
      {/* Premium Hero Welcome Section */}
      <div className="gradient-card bg-cosmic-gradient rounded-3xl p-10 relative overflow-hidden glow-effect">
        {/* Premium Floating Elements */}
        <div className="absolute top-8 right-8 w-40 h-40 bg-white/10 rounded-full animate-float-gentle"></div>
        <div
          className="absolute bottom-8 left-8 w-32 h-32 bg-white/5 rounded-full animate-float-gentle"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-float-gentle"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl animate-pulse-glow glow-effect">
                  <Sparkles className="h-12 w-12 text-white animate-bounce-in" />
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3 animate-bounce-in">
                    Welcome back, D23it176! 🚀
                  </h1>
                  <p className="text-white/90 text-2xl font-medium">
                    Ready to continue your amazing internship journey?
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Badge className="bg-white/20 text-white border-white/30 px-8 py-4 text-lg font-bold backdrop-blur-sm shadow-xl hover-scale">
                  <Crown className="w-6 h-6 mr-3" />
                  Level 5 Student
                </Badge>
                <Badge className="bg-emerald-green/20 text-white border-emerald-green/30 px-8 py-4 text-lg font-bold backdrop-blur-sm shadow-xl hover-scale">
                  <Trophy className="w-6 h-6 mr-3" />
                  Top Performer
                </Badge>
                <Badge className="bg-golden-yellow/20 text-white border-golden-yellow/30 px-8 py-4 text-lg font-bold backdrop-blur-sm shadow-xl hover-scale">
                  <Flame className="w-6 h-6 mr-3" />7 Day Streak
                </Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="premium-card bg-white/20 backdrop-blur-sm p-8 text-center glow-effect">
                <div className="text-4xl font-bold text-white mb-3">Computer Engineering</div>
                <div className="text-white/80 text-xl font-medium">6th Semester • Roll: 21CE001</div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="status-dot status-active"></div>
                  <span className="text-white/90 font-bold text-lg">Active Status</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="premium-card bg-white/20 backdrop-blur-sm p-6 text-center hover-scale glow-effect">
                  <div className="text-3xl font-bold text-white">8.5</div>
                  <div className="text-white/80 text-lg font-medium">CGPA</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-golden-yellow fill-current" />
                    ))}
                  </div>
                </div>
                <div className="premium-card bg-white/20 backdrop-blur-sm p-6 text-center hover-scale glow-effect">
                  <div className="text-3xl font-bold text-white">95%</div>
                  <div className="text-white/80 text-lg font-medium">Attendance</div>
                  <Badge className="badge-emerald text-xs mt-2">Excellent</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="premium-card hover-glow-premium animate-slide-up border-0 glow-effect"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-4">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${stat.gradient} rounded-3xl shadow-2xl hover-scale`}
                >
                  <stat.icon className="h-8 w-8 text-white animate-bounce-in" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-5xl font-bold text-gray-900 my-3">{stat.value}</p>
                  <p className="text-lg text-gray-500 font-bold">{stat.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-green bg-emerald-green/10 px-4 py-3 rounded-2xl shadow-lg">
                <ArrowUpRight className="h-5 w-5" />
                <span className="text-lg font-bold">{stat.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Premium Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Premium Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="premium-card border-0 glow-effect">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-electric-gradient rounded-3xl shadow-2xl">
                    <Activity className="h-8 w-8 text-white animate-bounce-in" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Recent Activities</h3>
                    <p className="text-gray-600 font-bold text-lg">Your latest achievements and updates</p>
                  </div>
                </div>
                <Badge className="badge-electric animate-pulse-glow text-lg px-6 py-3">
                  <Bell className="w-5 h-5 mr-3" />
                  Live Updates
                </Badge>
              </div>

              <div className="space-y-8">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-8 p-8 rounded-3xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 transition-all duration-500 hover-lift-premium animate-slide-left border border-gray-100 glow-effect"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`flex items-center justify-center w-16 h-16 ${activity.gradient} rounded-3xl shadow-2xl hover-scale`}
                    >
                      <activity.icon className="h-8 w-8 text-white animate-bounce-in" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-2xl mb-3">{activity.title}</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed text-lg">{activity.description}</p>
                      <div className="flex items-center gap-6">
                        <p className="text-lg text-gray-500 flex items-center gap-3 font-medium">
                          <Clock className="h-5 w-5" />
                          {activity.time}
                        </p>
                        <Badge
                          className={
                            activity.status === "success"
                              ? "badge-emerald text-lg px-4 py-2"
                              : activity.status === "info"
                                ? "badge-electric text-lg px-4 py-2"
                                : "badge-sunset text-lg px-4 py-2"
                          }
                        >
                          {activity.status === "success" ? "Completed" : activity.status === "info" ? "New" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <Button className="btn-electric w-full h-16 text-xl font-bold hover-scale glow-effect">
                  <Eye className="mr-4 h-6 w-6" />
                  View All Activities
                  <ArrowUpRight className="ml-4 h-6 w-6" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Premium Sidebar Content */}
        <div className="space-y-10">
          {/* Premium Upcoming Deadlines */}
          <Card className="premium-card border-0 glow-effect">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-14 h-14 bg-sunset-gradient rounded-3xl shadow-2xl">
                  <AlertCircle className="h-7 w-7 text-white animate-bounce-in" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Upcoming Deadlines</h3>
                  <p className="text-gray-600 font-medium">Don't miss these important dates</p>
                </div>
              </div>

              <div className="space-y-6">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={deadline.id}
                    className="flex items-center gap-6 p-6 rounded-3xl bg-gradient-to-r from-gray-50 to-white hover:from-orange-50 hover:to-pink-50 transition-all duration-500 hover-lift-premium animate-slide-up border border-gray-100 glow-effect"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`flex items-center justify-center w-14 h-14 ${deadline.gradient} rounded-2xl shadow-2xl hover-scale`}
                    >
                      <deadline.icon className="h-7 w-7 text-white animate-bounce-in" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{deadline.title}</p>
                      <p className="text-lg text-gray-500 flex items-center gap-2 mt-2 font-medium">
                        <Calendar className="h-4 w-4" />
                        {deadline.date}
                      </p>
                    </div>
                    <Badge
                      className={
                        deadline.priority === "high"
                          ? "badge-rose animate-pulse-glow text-lg px-4 py-2"
                          : deadline.priority === "medium"
                            ? "badge-sunset text-lg px-4 py-2"
                            : "badge-electric text-lg px-4 py-2"
                      }
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Premium Progress Overview */}
          <Card className="premium-card border-0 glow-effect">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-14 h-14 bg-emerald-gradient rounded-3xl shadow-2xl">
                  <TrendingUp className="h-7 w-7 text-white animate-bounce-in" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Progress Overview</h3>
                  <p className="text-gray-600 font-medium">Your semester journey</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-lg mb-4">
                    <span className="text-gray-600 font-bold">Overall Completion</span>
                    <span className="font-bold text-gray-900">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="progress-electric h-4 rounded-full transition-all duration-1500 ease-out shadow-lg"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-lg mb-4">
                    <span className="text-gray-600 font-bold">Reports Submitted</span>
                    <span className="font-bold text-gray-900">12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="progress-emerald h-4 rounded-full transition-all duration-1500 ease-out shadow-lg"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-lg mb-4">
                    <span className="text-gray-600 font-bold">Attendance Rate</span>
                    <span className="font-bold text-gray-900">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="progress-sunset h-4 rounded-full transition-all duration-1500 ease-out shadow-lg"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-electric-gradient rounded-3xl text-white shadow-2xl hover-scale">
                    <div className="text-3xl font-bold">250</div>
                    <div className="text-sm opacity-90 font-medium">XP Earned</div>
                  </div>
                  <div className="text-center p-6 bg-emerald-gradient rounded-3xl text-white shadow-2xl hover-scale">
                    <div className="text-3xl font-bold">5</div>
                    <div className="text-sm opacity-90 font-medium">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Premium Motivation Card */}
          <Card className="gradient-card bg-royal-gradient border-0 glow-effect">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mx-auto mb-6 animate-float-gentle">
                <Heart className="h-10 w-10 text-white animate-pulse-glow" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">You're Doing Amazing! 🌟</h3>
              <p className="text-white/90 mb-6 text-lg">
                Keep up the excellent work. You're on track to achieve all your goals this semester.
              </p>
              <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 font-bold text-lg hover-scale">
                <Diamond className="w-5 h-5 mr-3" />
                Top 10% Student
              </Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Premium Quick Actions */}
      <Card className="premium-card border-0 glow-effect">
        <div className="p-10">
          <div className="flex items-center gap-6 mb-10">
            <div className="flex items-center justify-center w-16 h-16 bg-cosmic-gradient rounded-3xl shadow-2xl">
              <Target className="h-8 w-8 text-white animate-bounce-in" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-gray-600 font-bold text-lg">Frequently used features for faster access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                variant="ghost"
                className="h-auto p-8 premium-card hover-glow-premium animate-slide-up border-0 glow-effect"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div
                    className={`w-20 h-20 ${action.gradient} rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover-scale`}
                  >
                    <action.icon className="h-10 w-10 text-white animate-bounce-in" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-2xl">{action.title}</p>
                    <p className="text-lg text-gray-600 mt-3 font-medium">{action.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Premium Bar Chart */}
      <div className="mt-10">
        <Card className="premium-card border-0 glow-effect">
          <div className="p-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Monthly Totals</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
