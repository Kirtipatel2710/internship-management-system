"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, UploadCloud, Download, Eye, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface WeeklyReportItem {
  id: string
  weekNumber: number
  title: string
  description: string
  fileUrl?: string
  status: "submitted" | "reviewed" | "approved" | "needs_revision"
  teacherComments?: string
  submittedAt: string
}

const dummyWeeklyReports: WeeklyReportItem[] = [
  {
    id: "wr1",
    weekNumber: 1,
    title: "Initial Setup and Project Planning",
    description: "Set up development environment, planned project architecture, and defined initial tasks.",
    fileUrl: "/placeholder.pdf",
    status: "approved",
    teacherComments: "Great start! Clear objectives.",
    submittedAt: "2024-07-07",
  },
  {
    id: "wr2",
    weekNumber: 2,
    title: "Frontend Development Progress",
    description: "Implemented user authentication UI and integrated with API endpoints. Started dashboard layout.",
    fileUrl: "/placeholder.pdf",
    status: "needs_revision",
    teacherComments: "Please provide more details on API integration challenges.",
    submittedAt: "2024-07-14",
  },
  {
    id: "wr3",
    weekNumber: 3,
    title: "Backend API Development",
    description:
      "Developed core API endpoints for user management and data fetching. Implemented basic data validation.",
    fileUrl: "/placeholder.pdf",
    status: "submitted",
    submittedAt: "2024-07-21",
  },
]

export function WeeklyReports() {
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReportItem[]>(dummyWeeklyReports)
  const [newReportWeek, setNewReportWeek] = useState<number | string>("")
  const [newReportTitle, setNewReportTitle] = useState("")
  const [newReportDescription, setNewReportDescription] = useState("")
  const [newReportFile, setNewReportFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewReportFile(event.target.files[0])
    }
  }

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReportWeek || !newReportTitle || !newReportDescription) {
      toast.error("Missing Information", {
        description: "Please fill in week number, title, and description.",
      })
      return
    }
    if (typeof newReportWeek === "string" || isNaN(Number(newReportWeek))) {
      toast.error("Invalid Week Number", {
        description: "Week number must be a valid number.",
      })
      return
    }

    const weekNum = Number(newReportWeek)
    if (weeklyReports.some((report) => report.weekNumber === weekNum)) {
      toast.error("Duplicate Week Number", {
        description: `A report for Week ${weekNum} already exists.`,
      })
      return
    }

    // Simulate file upload and getting a URL
    const simulatedFileUrl = newReportFile ? `/uploads/${newReportFile.name}` : undefined

    const newReport: WeeklyReportItem = {
      id: `wr${weeklyReports.length + 1}`,
      weekNumber: weekNum,
      title: newReportTitle,
      description: newReportDescription,
      fileUrl: simulatedFileUrl,
      status: "submitted",
      submittedAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    }

    setWeeklyReports([...weeklyReports, newReport])
    toast.success("Weekly Report Submitted", {
      description: `Week ${weekNum} report has been submitted successfully.`,
    })
    setNewReportWeek("")
    setNewReportTitle("")
    setNewReportDescription("")
    setNewReportFile(null)
  }

  const getStatusIcon = (status: WeeklyReportItem["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "submitted":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "reviewed":
        return <Eye className="h-5 w-5 text-purple-500" />
      case "needs_revision":
        return <XCircle className="h-5 w-5 text-orange-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: WeeklyReportItem["status"]) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "submitted":
        return "Submitted (Pending Review)"
      case "reviewed":
        return "Reviewed"
      case "needs_revision":
        return "Needs Revision"
      default:
        return "Unknown Status"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Submit Weekly Report</CardTitle>
          <CardDescription>Submit your weekly progress report for your internship.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReport} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="weekNumber">Week Number</Label>
              <Input
                id="weekNumber"
                type="number"
                placeholder="e.g., 1, 2, 3"
                value={newReportWeek}
                onChange={(e) => setNewReportWeek(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reportTitle">Report Title</Label>
              <Input
                id="reportTitle"
                placeholder="e.g., Week 1: Project Setup"
                value={newReportTitle}
                onChange={(e) => setNewReportTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reportDescription">Description of Work Done</Label>
              <Textarea
                id="reportDescription"
                placeholder="Detail your tasks, achievements, and challenges for the week."
                value={newReportDescription}
                onChange={(e) => setNewReportDescription(e.target.value)}
                rows={6}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reportFile">Supporting Document (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <UploadCloud className="w-6 h-6 mb-1 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX (MAX. 5MB)</p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {newReportFile && <p className="text-sm text-muted-foreground mt-1">Selected: {newReportFile.name}</p>}
            </div>
            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Weekly Reports</CardTitle>
          <CardDescription>Track the status and feedback for your submitted reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyReports.length === 0 ? (
            <p className="text-muted-foreground text-center">No weekly reports submitted yet.</p>
          ) : (
            <div className="grid gap-4">
              {weeklyReports.map((report) => (
                <Card
                  key={report.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">
                        Week {report.weekNumber}: {report.title}
                      </p>
                      <p className="text-sm text-muted-foreground">Submitted: {report.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className="text-sm font-medium">{getStatusText(report.status)}</span>
                    </div>
                    {report.teacherComments && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground">
                            View Teacher Comments
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Teacher Comments for Week {report.weekNumber}</DialogTitle>
                          </DialogHeader>
                          <p>{report.teacherComments}</p>
                        </DialogContent>
                      </Dialog>
                    )}
                    {report.fileUrl && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-5 w-5" />
                          <span className="sr-only">Download Report</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
