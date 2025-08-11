"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Building2,
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  Star,
  ArrowRight,
  Eye,
  Plus,
  Activity,
  RefreshCw,
} from "lucide-react"
import { getTpOfficerDashboardStats, getTpOfficerRecentActivities } from "@/lib/supabase-tp-officer-consistent"
import { toast } from "sonner"

export function TPOfficerOverview() {
  const [stats, setStats] = useState<any>(null)
  const [recentNOCs, setRecentNOCs] = useState<any[]>([])
  const [recentCompanies, setRecentCompanies] = useState<any[]>([])
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [dashboardStats, recentActivities] = await Promise.all([
        getTpOfficerDashboardStats(),
        getTpOfficerRecentActivities(),
      ])

      setStats(dashboardStats)
      setRecentNOCs(recentActivities.recentNOCs)
      setRecentCompanies(recentActivities.recentCompanies)
      setRecentApplications(recentActivities.recentApplications)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_tpo":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>
      case "approved":
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Low</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Pending NOCs",
      value: stats?.nocs?.pending || 0,
      description: "Awaiting your approval",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "Need attention",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Verified Companies",
      value: stats?.companies?.verified || 0,
      description: "Active partnerships",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "Partnerships",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Active Internships",
      value: stats?.opportunities?.active || 0,
      description: "Currently posted",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "Opportunities",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending Applications",
      value: stats?.applications?.pending || 0,
      description: "Need review",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "Applications",
      gradient: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                Welcome back, Officer!
                <Activity className="h-8 w-8 animate-pulse" />
              </h2>
              <p className="text-blue-100 text-lg mb-4">
                You have{" "}
                <span className="font-bold text-white">
                  {(stats?.nocs?.pending || 0) + (stats?.companies?.pending || 0)} pending items
                </span>{" "}
                that need your attention today.
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
                  onClick={loadDashboardData}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent NOC Requests */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Recent NOC Requests
                </CardTitle>
                <CardDescription>Latest student NOC submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNOCs.length > 0 ? (
              recentNOCs.map((noc) => (
                <div
                  key={noc.id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{noc.profiles?.name || "Unknown Student"}</h4>
                      <p className="text-sm text-gray-500">{noc.profiles?.enrollment_no}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(noc.priority)}
                      {getStatusBadge(noc.status)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Company:</span> {noc.company_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Role:</span> {noc.internship_role}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(noc.created_at)}
                      </div>
                      {noc.status === "pending_tpo" && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 group-hover:scale-105 transition-transform"
                        >
                          Review
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent NOC requests</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Company Verifications */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  Company Verifications
                </CardTitle>
                <CardDescription>Companies awaiting verification</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCompanies.length > 0 ? (
              recentCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    </div>
                    {getStatusBadge(company.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Contact:</span> {company.contact_person}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Documents:</span> {company.documents?.length || 0} files
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(company.created_at)}
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 group-hover:scale-105 transition-transform"
                      >
                        Verify
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending company verifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
              <Star className="h-5 w-5 text-white" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used actions for efficient workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Review NOCs</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <Building2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Verify Companies</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Post Internship</span>
            </Button>
            <Button className="h-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex-col gap-2 group hover:scale-105 transition-all duration-300 shadow-lg">
              <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Review Applications</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {((stats?.nocs?.pending || 0) > 0 || (stats?.companies?.pending || 0) > 0) && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              Important Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats?.nocs?.pending || 0) > 0 && (
                <div className="flex items-center gap-3 p-4 bg-orange-100/50 rounded-xl border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-orange-800">
                    <strong>{stats.nocs.pending} NOC requests</strong> are pending approval and need your attention
                  </span>
                </div>
              )}
              {(stats?.companies?.pending || 0) > 0 && (
                <div className="flex items-center gap-3 p-4 bg-blue-100/50 rounded-xl border border-blue-200">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>{stats.companies.pending} companies</strong> are waiting for verification review
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
