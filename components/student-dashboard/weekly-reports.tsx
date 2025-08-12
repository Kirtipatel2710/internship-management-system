"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase, uploadFile, type WeeklyReport } from "@/lib/supabase"
import { Calendar, Plus, FileText, Clock, CheckCircle, AlertCircle, Upload, Download } from "lucide-react"
import { toast } from "sonner"

const statusConfig = {
  pending_review: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  approved: {
    label: "Approved", 
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  needs_changes: {
    label: "Needs Changes",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
}

export function WeeklyReports() {
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    week_number: 1,
    week_start_date: "",
    week_end_date: "",
    comments: "",
  })
  const [reportFile, setReportFile] = useState<File | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Updated to use profiles table instead of direct user.id
      const { data, error } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("student_id", user.id)
        .order("week_number", { ascending: false })

      if (error) throw error

      setReports(data || [])
    } catch (error) {
      console.error("Error fetching weekly reports:", error)
      toast.error("Failed to load weekly reports")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.week_number || !formData.week_start_date || !formData.week_end_date) {
      toast.error("Missing Required Fields", {
        description: "Please fill in week number and date range",
      })
      return false
    }

    if (new Date(formData.week_start_date) >= new Date(formData.week_end_date)) {
      toast.error("Invalid Date Range", {
        description: "End date must be after start date",
      })
      return false
    }

    if (!reportFile) {
      toast.error("File Required", {
        description: "Please upload your weekly report file",
      })
      return false
    }

    // Check for duplicate week numbers
    const existingWeek = reports.find((r) => r.week_number === formData.week_number)
    if (existingWeek) {
      toast.error("Duplicate Week", {
        description: `Week ${formData.week_number} report already exists`,
      })
      return false
    }

    return true
  }

  const handleFileUpload = async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid File Type", {
        description: "Please upload PDF, DOC, or DOCX files only",
      })
      return null
    }

    if (file.size > maxSize) {
      toast.error("File Too Large", {
        description: "File size must be less than 10MB", 
      })
      return null
    }

    setUploading(true)
    try {
      const fileName = `week-${formData.week_number}-${Date.now()}-${file.name}`
      const { url, error } = await uploadFile(file, "weekly-reports", fileName)
      
      if (error) {
        throw error
      }

      return url
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload Failed", {
        description: "Failed to upload weekly report",
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Authentication Required", {
          description: "Please sign in to submit weekly report",
        })
        return
      }

      const fileUrl = await handleFileUpload(reportFile!)
      if (!fileUrl) return // Upload failed

      const { error } = await supabase.from("weekly_reports").insert({
        student_id: user.id,
        week_number: formData.week_number,
        week_start_date: formData.week_start_date,
        week_end_date: formData.week_end_date,
        file_url: fileUrl,
        comments: formData.comments,
        status: "pending_review",
        submitted_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Weekly Report Submitted!", {
        description: "Your report has been submitted for review",
      })

      // Reset form and close dialog
      setFormData({
        week_number: getNextWeekNumber(),
        week_start_date: "",
        week_end_date: "",
        comments: "",
      })
      setReportFile(null)
      setDialogOpen(false)
      fetchReports()
    } catch (error) {
      console.error("Error submitting weekly report:", error)
      toast.error("Submission Failed", {
        description: "Failed to submit weekly report. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getNextWeekNumber = () => {
    if (reports.length === 0) return 1
    return Math.max(...reports.map((r) => r.week_number)) + 1
  }

  // Initialize form with next week number when dialog opens
  const handleDialogOpen = () => {
    setFormData(prev => ({
      ...prev,
      week_number: getNextWeekNumber()
    }))
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Reports</h1>
          <p className="text-gray-600">Track your internship progress with weekly reports</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleDialogOpen}>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Weekly Report</DialogTitle>
              <DialogDescription>Upload your weekly progress report</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="week_number">Week Number *</Label>
                  <Input
                    id="week_number"
                    type="number"
                    min="1"
                    value={formData.week_number}
                    onChange={(e) => setFormData({ ...formData, week_number: Number.parseInt(e.target.value) })}
                    placeholder={getNextWeekNumber().toString()}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="week_start_date">Start Date *</Label>
                  <Input
                    id="week_start_date"
                    type="date"
                    value={formData.week_start_date}
                    onChange={(e) => setFormData({ ...formData, week_start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="week_end_date">End Date *</Label>
                  <Input
                    id="week_end_date"
                    type="date"
                    value={formData.week_end_date}
                    onChange={(e) => setFormData({ ...formData, week_end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="report_file">Weekly Report File * (PDF, DOC, DOCX - Max 10MB)</Label>
                <Input
                  id="report_file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                  className="mt-1"
                  required
                />
                {reportFile && <p className="text-sm text-green-600 mt-1">Selected: {reportFile.name}</p>}
              </div>

              <div>
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Any additional comments about this week's work..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || uploading}>
                  {submitting || uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {uploading ? "Uploading..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Submitted reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "pending_review").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "approved").length}</div>
            <p className="text-xs text-muted-foreground">Approved reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Changes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "needs_changes").length}</div>
            <p className="text-xs text-muted-foreground">Require revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const statusInfo = statusConfig[report.status as keyof typeof statusConfig]
          const StatusIcon = statusInfo.icon

          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Week {report.week_number} Report</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.week_start_date).toLocaleDateString()} -{" "}
                      {new Date(report.week_end_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={statusInfo.color}>
                    <div className="flex items-center">
                      <StatusIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">{statusInfo.label}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.comments && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Comments:</h4>
                    <p className="text-sm text-gray-600">{report.comments}</p>
                  </div>
                )}

                {report.teacher_feedback && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-sm text-blue-900 mb-1">Teacher Feedback:</h4>
                    <p className="text-sm text-blue-800">{report.teacher_feedback}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Submitted: {new Date(report.submitted_at).toLocaleDateString()}
                    {report.reviewed_at && (
                      <span className="block">Reviewed: {new Date(report.reviewed_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(report.file_url, "_blank")}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {reports.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-500 mb-4">Start documenting your internship progress with weekly reports.</p>
            <Button onClick={handleDialogOpen}>
              <Plus className="h-4 w-4 mr-2" />
              Submit First Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}