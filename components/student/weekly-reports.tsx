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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { Calendar, Plus, FileText, Clock, CheckCircle, AlertCircle, Edit } from "lucide-react"
import { toast } from "sonner"

interface WeeklyReport {
  id: string
  student_id: string
  application_id: string
  week_number: number
  start_date: string
  end_date: string
  tasks_completed: string
  learning_outcomes?: string
  challenges_faced?: string
  mentor_feedback?: string
  student_reflection?: string
  hours_worked: number
  status: "draft" | "submitted" | "reviewed" | "approved"
  submitted_at?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

interface InternshipApplication {
  id: string
  opportunity_id: string
  status: string
  internship_opportunities: {
    title: string
    companies: {
      name: string
    }
  }
}

export function WeeklyReports() {
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [applications, setApplications] = useState<InternshipApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState("")
  const [formData, setFormData] = useState({
    week_number: 1,
    start_date: "",
    end_date: "",
    tasks_completed: "",
    learning_outcomes: "",
    challenges_faced: "",
    mentor_feedback: "",
    student_reflection: "",
    hours_worked: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch approved applications
      const { data: applicationsData, error: appsError } = await supabase
        .from("internship_applications")
        .select(`
          id,
          opportunity_id,
          status,
          internship_opportunities (
            title,
            companies (
              name
            )
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "approved")

      if (appsError) throw appsError

      setApplications(applicationsData || [])

      // Fetch weekly reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("student_id", user.id)
        .order("week_number", { ascending: false })

      if (reportsError) throw reportsError

      setReports(reportsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApplication) {
      toast.error("Please select an internship")
      return
    }

    setSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to submit report")
        return
      }

      const { error } = await supabase.from("weekly_reports").insert({
        student_id: user.id,
        application_id: selectedApplication,
        ...formData,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Weekly report submitted successfully!")
      setFormData({
        week_number: 1,
        start_date: "",
        end_date: "",
        tasks_completed: "",
        learning_outcomes: "",
        challenges_faced: "",
        mentor_feedback: "",
        student_reflection: "",
        hours_worked: 0,
      })
      setSelectedApplication("")
      fetchData()
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit report")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "submitted":
      case "reviewed":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
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

        {applications.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Weekly Report</DialogTitle>
                <DialogDescription>Document your weekly progress and learnings</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="application">Select Internship *</Label>
                  <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your internship" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.internship_opportunities.title} at {app.internship_opportunities.companies.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="week_number">Week Number *</Label>
                    <Input
                      id="week_number"
                      type="number"
                      min="1"
                      value={formData.week_number}
                      onChange={(e) => setFormData({ ...formData, week_number: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hours_worked">Hours Worked</Label>
                  <Input
                    id="hours_worked"
                    type="number"
                    min="0"
                    value={formData.hours_worked}
                    onChange={(e) => setFormData({ ...formData, hours_worked: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="tasks_completed">Tasks Completed *</Label>
                  <Textarea
                    id="tasks_completed"
                    placeholder="Describe the tasks you completed this week..."
                    value={formData.tasks_completed}
                    onChange={(e) => setFormData({ ...formData, tasks_completed: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
                  <Textarea
                    id="learning_outcomes"
                    placeholder="What did you learn this week?"
                    value={formData.learning_outcomes}
                    onChange={(e) => setFormData({ ...formData, learning_outcomes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="challenges_faced">Challenges Faced</Label>
                  <Textarea
                    id="challenges_faced"
                    placeholder="Describe any challenges you encountered..."
                    value={formData.challenges_faced}
                    onChange={(e) => setFormData({ ...formData, challenges_faced: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="mentor_feedback">Mentor Feedback</Label>
                  <Textarea
                    id="mentor_feedback"
                    placeholder="Any feedback received from your mentor..."
                    value={formData.mentor_feedback}
                    onChange={(e) => setFormData({ ...formData, mentor_feedback: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="student_reflection">Personal Reflection</Label>
                  <Textarea
                    id="student_reflection"
                    placeholder="Your thoughts and reflections on the week..."
                    value={formData.student_reflection}
                    onChange={(e) => setFormData({ ...formData, student_reflection: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Week {report.week_number} Report</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(report.start_date).toLocaleDateString()} -{" "}
                    {new Date(report.end_date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(report.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Hours Worked:</span> {report.hours_worked}
              </div>

              <div>
                <h4 className="font-medium text-sm mb-1">Tasks Completed:</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{report.tasks_completed}</p>
              </div>

              {report.learning_outcomes && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Learning Outcomes:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{report.learning_outcomes}</p>
                </div>
              )}

              {report.challenges_faced && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Challenges:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{report.challenges_faced}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>
                  Submitted:{" "}
                  {report.submitted_at ? new Date(report.submitted_at).toLocaleDateString() : "Not submitted"}
                </span>
                {report.status === "draft" && (
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approved internships</h3>
            <p className="text-gray-500">
              You need to have an approved internship application to submit weekly reports.
            </p>
          </CardContent>
        </Card>
      )}

      {reports.length === 0 && applications.length > 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-500 mb-4">Start documenting your internship progress with weekly reports.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Report
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
