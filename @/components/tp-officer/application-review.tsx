"use client"

import { Separator } from "@/components/ui/separator"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, FileText, User, Briefcase, Mail, Calendar, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"

interface Application {
  id: string
  studentName: string
  studentEmail: string
  opportunityTitle: string
  companyName: string
  appliedDate: string
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  resumeUrl: string
  coverLetter?: string
  additionalDocuments?: string[]
  teacherComments?: string
  rejectionReason?: string
}

const dummyApplications: Application[] = [
  {
    id: "app1",
    studentName: "Alice Smith",
    studentEmail: "alice.smith@example.com",
    opportunityTitle: "Software Development Intern",
    companyName: "Tech Solutions Inc.",
    appliedDate: "2024-07-20",
    status: "approved_teacher",
    resumeUrl: "/placeholder.pdf?query=Alice_Resume.pdf",
    coverLetter: "Passionate about coding and eager to contribute to innovative projects.",
    teacherComments: "Strong technical skills, good fit for the role.",
  },
  {
    id: "app2",
    studentName: "Bob Johnson",
    studentEmail: "bob.j@example.com",
    opportunityTitle: "Data Analyst Intern",
    companyName: "Global Innovations",
    appliedDate: "2024-07-18",
    status: "pending_teacher",
    resumeUrl: "/placeholder.pdf?query=Bob_Resume.pdf",
    additionalDocuments: ["/placeholder.pdf?query=Bob_Cert.pdf"],
  },
  {
    id: "app3",
    studentName: "Charlie Brown",
    studentEmail: "charlie.b@example.com",
    opportunityTitle: "Marketing Intern",
    companyName: "Creative Minds Agency",
    appliedDate: "2024-07-15",
    status: "rejected",
    resumeUrl: "/placeholder.pdf?query=Charlie_Resume.pdf",
    rejectionReason: "Lack of relevant experience in digital marketing.",
  },
  {
    id: "app4",
    studentName: "Diana Prince",
    studentEmail: "diana.p@example.com",
    opportunityTitle: "UI/UX Design Intern",
    companyName: "Design Innovators",
    appliedDate: "2024-07-22",
    status: "pending_tpo",
    resumeUrl: "/placeholder.pdf?query=Diana_Resume.pdf",
    coverLetter: "Excited to apply design principles to real-world problems.",
    teacherComments: "Excellent portfolio, highly recommended.",
  },
]

export function ApplicationReview() {
  const [applications, setApplications] = useState<Application[]>(dummyApplications)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "approved", rejectionReason: undefined } : app)),
    )
    toast.success("Application Approved", {
      description: `Application ID: ${id} has been approved.`,
    })
    setIsDialogOpen(false)
  }

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection Reason Required", {
        description: "Please provide a reason for rejection.",
      })
      return
    }
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected", rejectionReason } : app)),
    )
    toast.error("Application Rejected", {
      description: `Application ID: ${id} has been rejected.`,
    })
    setIsDialogOpen(false)
    setRejectionReason("")
  }

  const openDetailsDialog = (application: Application) => {
    setSelectedApplication(application)
    setRejectionReason(application.rejectionReason || "")
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "pending_teacher":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pending Teacher
          </Badge>
        )
      case "approved_teacher":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            Teacher Approved
          </Badge>
        )
      case "pending_tpo":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Pending TPO
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Approved
          </Badge>
        )
      case "rejected":
      case "rejected_teacher":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getFilteredApplications = (filterStatus: string) => {
    if (filterStatus === "all") {
      return applications
    }
    return applications.filter((app) => {
      if (filterStatus === "pending") {
        return app.status === "pending_teacher" || app.status === "pending_tpo"
      }
      return app.status === filterStatus
    })
  }

  const [activeTab, setActiveTab] = useState("pending")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Internship Application Review</CardTitle>
        <CardDescription>Review and manage student applications for internship opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant={activeTab === "pending" ? "default" : "outline"} onClick={() => setActiveTab("pending")}>
            Pending ({getFilteredApplications("pending").length})
          </Button>
          <Button variant={activeTab === "approved" ? "default" : "outline"} onClick={() => setActiveTab("approved")}>
            Approved ({getFilteredApplications("approved").length})
          </Button>
          <Button variant={activeTab === "rejected" ? "default" : "outline"} onClick={() => setActiveTab("rejected")}>
            Rejected ({getFilteredApplications("rejected").length})
          </Button>
          <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>
            All ({getFilteredApplications("all").length})
          </Button>
        </div>

        {getFilteredApplications(activeTab).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No applications in this category.</p>
        ) : (
          <div className="grid gap-4">
            {getFilteredApplications(activeTab).map((app) => (
              <Card key={app.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <User className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{app.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.opportunityTitle} at {app.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end md:items-center gap-2">
                  {getStatusBadge(app.status)}
                  <Button variant="outline" size="sm" onClick={() => openDetailsDialog(app)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {selectedApplication && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>Review the full application from {selectedApplication.studentName}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                  <p className="font-semibold">{selectedApplication.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Email</p>
                  <p className="font-semibold flex items-center gap-1">
                    {selectedApplication.studentEmail} <Mail className="h-4 w-4" />
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Opportunity</p>
                <p className="font-semibold flex items-center gap-1">
                  {selectedApplication.opportunityTitle} at {selectedApplication.companyName}{" "}
                  <Briefcase className="h-4 w-4" />
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applied Date</p>
                <p className="font-semibold flex items-center gap-1">
                  {selectedApplication.appliedDate} <Calendar className="h-4 w-4" />
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Resume</h4>
                <Button variant="outline" asChild>
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> View Resume
                  </a>
                </Button>
              </div>
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="font-semibold mb-2">Cover Letter</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              )}
              {selectedApplication.additionalDocuments && selectedApplication.additionalDocuments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Documents</h4>
                  <div className="grid gap-2">
                    {selectedApplication.additionalDocuments.map((doc, index) => (
                      <Button key={index} variant="outline" asChild className="justify-start bg-transparent">
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {doc.split("/").pop()}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Separator />
              {selectedApplication.teacherComments && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" /> Teacher Comments
                  </h4>
                  <p className="text-sm text-muted-foreground italic">{selectedApplication.teacherComments}</p>
                </div>
              )}
              {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Rejection Reason</h4>
                  <p className="text-sm text-red-500 italic">{selectedApplication.rejectionReason}</p>
                </div>
              )}
              {(selectedApplication.status === "pending_tpo" || selectedApplication.status === "approved_teacher") && (
                <div className="grid gap-2">
                  <Label htmlFor="rejectionReason">Rejection Reason (Optional for Approval)</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Enter reason for rejection if applicable..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              {(selectedApplication.status === "pending_tpo" || selectedApplication.status === "approved_teacher") && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={!rejectionReason.trim()}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button onClick={() => handleApprove(selectedApplication.id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
