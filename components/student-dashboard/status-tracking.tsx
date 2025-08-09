"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabaseClient"
import {
  FileText,
  Upload,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Eye,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface StatusItem {
  id: string
  type: "noc_request" | "weekly_report" | "certificate"
  title: string
  status: "pending" | "approved" | "rejected" | "submitted" | "reviewed"
  submitted_at: string
  updated_at?: string
  file_url?: string
  week_no?: number
  company_name?: string
  internship_title?: string
}

interface StatusSummary {
  total: number
  pending: number
  approved: number
  rejected: number
  completion_rate: number
}

export function StatusTracking() {
  const [statusItems, setStatusItems] = useState<StatusItem[]>([])
  const [summary, setSummary] = useState<StatusSummary>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completion_rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchStatusData()
  }, [])

  const fetchStatusData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch all data in parallel
      const [nocData, reportsData, certificatesData] = await Promise.all([
        supabase.from("noc_requests").select("*").eq("student_id", user.id).order("requested_at", { ascending: false }),
        supabase
          .from("weekly_reports")
          .select("*")
          .eq("student_id", user.id)
          .order("submitted_at", { ascending: false }),
        supabase.from("certificates").select("*").eq("student_id", user.id).order("submitted_at", { ascending: false }),
      ])

      // Transform data into unified format
      const allItems: StatusItem[] = []

      // NOC Requests
      if (nocData.data) {
        nocData.data.forEach((item) => {
          allItems.push({
            id: item.id,
            type: "noc_request",
            title: `NOC Request - ${item.company_name}`,
            status: item.status,
            submitted_at: item.requested_at,
            updated_at: item.approved_at,
            file_url: item.file_url,
            company_name: item.company_name,
          })
        })
      }

      // Weekly Reports
      if (reportsData.data) {
        reportsData.data.forEach((item) => {
          allItems.push({
            id: item.id,
            type: "weekly_report",
            title: `Weekly Report #${item.week_no}`,
            status: item.status,
            submitted_at: item.submitted_at,
            updated_at: item.reviewed_at,
            file_url: item.file_url,
            week_no: item.week_no,
          })
        })
      }

      // Certificates
      if (certificatesData.data) {
        certificatesData.data.forEach((item) => {
          allItems.push({
            id: item.id,
            type: "certificate",
            title: `Certificate - ${item.internship_title}`,
            status: item.status,
            submitted_at: item.submitted_at,
            updated_at: item.approved_at,
            file_url: item.file_url,
            internship_title: item.internship_title,
          })
        })
      }

      // Sort by submission date
      allItems.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())

      setStatusItems(allItems)

      // Calculate summary
      const total = allItems.length
      const pending = allItems.filter((item) => item.status === "pending" || item.status === "submitted").length
      const approved = allItems.filter((item) => item.status === "approved" || item.status === "reviewed").length
      const rejected = allItems.filter((item) => item.status === "rejected").length
      const completion_rate = total > 0 ? Math.round((approved / total) * 100) : 0

      setSummary({ total, pending, approved, rejected, completion_rate })
    } catch (error) {
      console.error("Error fetching status data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch status information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStatusData()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "reviewed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
      case "submitted":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "reviewed":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
      case "submitted":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "noc_request":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "weekly_report":
        return <Upload className="h-5 w-5 text-green-600" />
      case "certificate":
        return <Award className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Status Tracking</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Status Tracking</h2>
          <p className="text-gray-600">Track the status of all your submissions and approvals</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{summary.completion_rate}%</div>
            <Progress value={summary.completion_rate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Timeline</CardTitle>
          <CardDescription>Chronological view of all your submissions and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {statusItems.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-gray-600">Start by submitting your first NOC request or weekly report</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statusItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span>Submitted: {formatDate(item.submitted_at)}</span>
                      </div>

                      {item.updated_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Updated: {formatDate(item.updated_at)}</span>
                        </div>
                      )}
                    </div>

                    {item.company_name && <p className="text-sm text-gray-600 mt-1">Company: {item.company_name}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.file_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
