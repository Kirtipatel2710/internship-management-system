"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Building2, Calendar, TrendingUp } from "lucide-react"

interface ApplicationStatus {
  id: string
  type: "application" | "noc"
  title: string
  company: string
  status: string
  submitted_date: string
  last_updated: string
  progress: number
  next_step: string
}

export function StatusTracking() {
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    fetchStatusData()
  }, [])

  const fetchStatusData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch internship applications
      const { data: applications, error: appsError } = await supabase
        .from("internship_applications")
        .select(`
          id,
          status,
          applied_at,
          updated_at,
          internship_opportunities (
            title,
            companies (
              name
            )
          )
        `)
        .eq("student_id", user.id)
        .order("applied_at", { ascending: false })

      if (appsError) throw appsError

      // Fetch NOC requests
      const { data: nocRequests, error: nocError } = await supabase
        .from("noc_requests")
        .select(`
          id,
          status,
          company_name,
          internship_role,
          created_at,
          updated_at
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })

      if (nocError) throw nocError

      // Transform applications data
      const applicationStatuses: ApplicationStatus[] = (applications || []).map((app: any) => ({
        id: app.id,
        type: "application",
        title: app.internship_opportunities.title,
        company: app.internship_opportunities.companies.name,
        status: app.status,
        submitted_date: app.applied_at,
        last_updated: app.updated_at,
        progress: getProgressPercentage(app.status, "application"),
        next_step: getNextStep(app.status, "application"),
      }))

      // Transform NOC requests data
      const nocStatuses: ApplicationStatus[] = (nocRequests || []).map((noc: any) => ({
        id: noc.id,
        type: "noc",
        title: noc.internship_role,
        company: noc.company_name,
        status: noc.status,
        submitted_date: noc.created_at,
        last_updated: noc.updated_at,
        progress: getProgressPercentage(noc.status, "noc"),
        next_step: getNextStep(noc.status, "noc"),
      }))

      const allStatuses = [...applicationStatuses, ...nocStatuses]
      setStatuses(allStatuses)

      // Calculate stats
      const total = allStatuses.length
      const pending = allStatuses.filter(
        (s) => s.status.includes("pending") || s.status.includes("teacher") || s.status.includes("tpo"),
      ).length
      const approved = allStatuses.filter((s) => s.status === "approved").length
      const rejected = allStatuses.filter((s) => s.status.includes("rejected")).length

      setStats({ total, pending, approved, rejected })
    } catch (error) {
      console.error("Error fetching status data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = (status: string, type: string) => {
    if (type === "application") {
      switch (status) {
        case "pending_teacher":
          return 25
        case "approved_teacher":
          return 50
        case "pending_tpo":
          return 75
        case "approved":
          return 100
        case "rejected":
          return 0
        default:
          return 0
      }
    } else {
      // NOC
      switch (status) {
        case "pending_teacher":
          return 33
        case "approved_teacher":
          return 66
        case "pending_tpo":
          return 83
        case "approved":
          return 100
        case "rejected":
          return 0
        default:
          return 0
      }
    }
  }

  const getNextStep = (status: string, type: string) => {
    if (type === "application") {
      switch (status) {
        case "pending_teacher":
          return "Waiting for teacher approval"
        case "approved_teacher":
          return "Waiting for T&P Officer approval"
        case "pending_tpo":
          return "Under T&P Officer review"
        case "approved":
          return "Application approved - Start internship"
        case "rejected":
          return "Application rejected"
        default:
          return "Unknown status"
      }
    } else {
      // NOC
      switch (status) {
        case "pending_teacher":
          return "Waiting for teacher approval"
        case "approved_teacher":
          return "Waiting for T&P Officer approval"
        case "pending_tpo":
          return "Under T&P Officer review"
        case "approved":
          return "NOC approved - Ready to start"
        case "rejected":
          return "NOC request rejected"
        default:
          return "Unknown status"
      }
    }
  }

  const getStatusColor = (status: string) => {
    if (status === "approved") return "bg-green-100 text-green-800"
    if (status.includes("rejected")) return "bg-red-100 text-red-800"
    if (status.includes("pending")) return "bg-yellow-100 text-yellow-800"
    if (status.includes("teacher")) return "bg-blue-100 text-blue-800"
    return "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-4 w-4" />
    if (status.includes("rejected")) return <XCircle className="h-4 w-4" />
    if (status.includes("pending")) return <Clock className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Status Tracking</h1>
        <p className="text-gray-600">Monitor the progress of your applications and NOC requests</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Applications & NOC requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Approval percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Status List */}
      <div className="space-y-4">
        {statuses.map((item) => (
          <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {item.company}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{formatStatus(item.status)}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>

              {/* Next Step */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">Next Step:</span>
                </div>
                <p className="text-sm text-blue-800 mt-1">{item.next_step}</p>
              </div>

              {/* Timeline */}
              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Submitted: {new Date(item.submitted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Updated: {new Date(item.last_updated).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {statuses.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions to track</h3>
            <p className="text-gray-500">Submit your first application or NOC request to start tracking progress.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
