"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import { toast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2, FileText, Calendar, MessageSquare, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WeeklyReport {
  id: string
  student_id: string
  week_no: number
  file_url: string
  status: "submitted" | "reviewed"
  comment: string | null
  submitted_at: string
  reviewed_by: string | null
  reviewed_at: string | null
}

interface ReportFormData {
  week_no: number
  file_url: string
  comment: string
}

export function WeeklyReports() {
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingReport, setEditingReport] = useState<WeeklyReport | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ReportFormData>({
    week_no: 1,
    file_url: "",
    comment: "",
  })

  useEffect(() => {
    fetchWeeklyReports()
  }, [])

  const fetchWeeklyReports = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("student_id", user.id)
        .order("week_no", { ascending: false })

      if (error) throw error

      setReports(data || [])
    } catch (error) {
      console.error("Error fetching weekly reports:", error)
      toast({
        title: "Error",
        description: "Failed to fetch weekly reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file_url || formData.week_no < 1) {
      toast({
        title: "Validation Error",
        description: "Please upload a report file and enter a valid week number",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      if (editingReport) {
        // Update existing report
        const { error } = await supabase
          .from("weekly_reports")
          .update({
            week_no: formData.week_no,
            file_url: formData.file_url,
            comment: formData.comment || null,
          })
          .eq("id", editingReport.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Weekly report updated successfully",
        })
      } else {
        // Create new report
        const { error } = await supabase.from("weekly_reports").insert({
          student_id: user.id,
          week_no: formData.week_no,
          file_url: formData.file_url,
          comment: formData.comment || null,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Weekly report submitted successfully",
        })
      }

      resetForm()
      setIsDialogOpen(false)
      fetchWeeklyReports()
    } catch (error: any) {
      console.error("Error submitting weekly report:", error)
      if (error.code === "23505") {
        toast({
          title: "Error",
          description: "A report for this week already exists. Please edit the existing report.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to submit weekly report",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (report: WeeklyReport) => {
    setEditingReport(report)
    setFormData({
      week_no: report.week_no,
      file_url: report.file_url,
      comment: report.comment || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this weekly report?")) return

    try {
      const { error } = await supabase.from("weekly_reports").delete().eq("id", reportId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Weekly report deleted successfully",
      })
      fetchWeeklyReports()
    } catch (error) {
      console.error("Error deleting weekly report:", error)
      toast({
        title: "Error",
        description: "Failed to delete weekly report",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      week_no: Math.max(...reports.map((r) => r.week_no), 0) + 1,
      file_url: "",
      comment: "",
    })
    setEditingReport(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return <Badge className="bg-green-100 text-green-800">Reviewed</Badge>
      default:
        return <Badge variant="secondary">Submitted</Badge>
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
          <h2 className="text-2xl font-bold tracking-tight">Weekly Reports</h2>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
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
          <h2 className="text-3xl font-bold tracking-tight">Weekly Reports</h2>
          <p className="text-gray-600">Upload and manage your weekly internship reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingReport ? "Edit Weekly Report" : "Upload Weekly Report"}</DialogTitle>
              <DialogDescription>Submit your weekly internship report with optional comments</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="week_no">Week Number *</Label>
                  <Input
                    id="week_no"
                    type="number"
                    min="1"
                    max="52"
                    value={formData.week_no}
                    onChange={(e) => setFormData({ ...formData, week_no: Number.parseInt(e.target.value) || 1 })}
                    placeholder="Enter week number"
                    required
                  />
                </div>

                <EnhancedFileUpload
                  bucket="reports"
                  path="weekly_reports"
                  onUploadComplete={(url) => setFormData({ ...formData, file_url: url })}
                  currentFile={formData.file_url}
                  label="Weekly Report File"
                  required
                  accept=".pdf,.doc,.docx"
                  maxSize={10}
                />

                <div className="space-y-2">
                  <Label htmlFor="comment">Additional Comments (Optional)</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Any additional information about your weekly progress..."
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !formData.file_url}>
                  {submitting ? "Uploading..." : editingReport ? "Update Report" : "Submit Report"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No weekly reports yet</h3>
            <p className="text-gray-600 mb-4">Upload your first weekly report to get started</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Week {report.week_no} Report
                    </CardTitle>
                    <CardDescription className="text-base">
                      Submitted on {formatDate(report.submitted_at)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">{getStatusBadge(report.status)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {report.comment && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Your Comments:</p>
                        <p className="text-sm text-blue-700 mt-1">{report.comment}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Report file attached</span>
                  <Button variant="ghost" size="sm" asChild className="ml-auto">
                    <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>

                {report.reviewed_at && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Reviewed on {formatDate(report.reviewed_at)}
                        </p>
                        <p className="text-sm text-green-700">Your report has been reviewed by the supervisor</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(report)}
                    disabled={report.status === "reviewed"}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(report.id)}
                    disabled={report.status === "reviewed"}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
