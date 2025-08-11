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

interface NOCRequest {
  id: string
  studentName: string
  studentEmail: string
  companyName: string
  internshipRole: string
  internshipDuration: string
  submittedDate: string
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  documents: string[]
  teacherComments?: string
  rejectionReason?: string
}

const dummyNOCRequests: NOCRequest[] = [
  {
    id: "noc1",
    studentName: "Alice Smith",
    studentEmail: "alice.s@example.com",
    companyName: "Tech Solutions Inc.",
    internshipRole: "Software Engineer Intern",
    internshipDuration: "6 months",
    submittedDate: "2024-07-20",
    status: "approved_teacher",
    documents: ["/placeholder.pdf?query=Alice_Offer_Letter.pdf"],
    teacherComments: "Student has good academic standing. Recommended for TPO approval.",
  },
  {
    id: "noc2",
    studentName: "Bob Johnson",
    studentEmail: "bob.j@example.com",
    companyName: "Global Innovations",
    internshipRole: "Data Analyst Intern",
    internshipDuration: "3 months",
    submittedDate: "2024-07-18",
    status: "pending_teacher",
    documents: ["/placeholder.pdf?query=Bob_Offer_Letter.pdf"],
  },
  {
    id: "noc3",
    studentName: "Charlie Brown",
    studentEmail: "charlie.b@example.com",
    companyName: "Creative Minds Agency",
    internshipRole: "Marketing Intern",
    internshipDuration: "4 months",
    submittedDate: "2024-07-15",
    status: "rejected",
    documents: ["/placeholder.pdf?query=Charlie_Offer_Letter.pdf"],
    rejectionReason: "Company not recognized by the department.",
  },
  {
    id: "noc4",
    studentName: "Diana Prince",
    studentEmail: "diana.p@example.com",
    companyName: "Design Innovators",
    internshipRole: "UI/UX Design Intern",
    internshipDuration: "5 months",
    submittedDate: "2024-07-22",
    status: "pending_tpo",
    documents: [
      "/placeholder.pdf?query=Diana_Offer_Letter.pdf",
      "/placeholder.pdf?query=Diana_Internship_Agreement.pdf",
    ],
    teacherComments: "All documents verified by teacher. Forwarded to TPO.",
  },
]

export function NOCManagement() {
  const [nocRequests, setNocRequests] = useState<NOCRequest[]>(dummyNOCRequests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedNOC, setSelectedNOC] = useState<NOCRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: string) => {
    setNocRequests((prev) =>
      prev.map((noc) => (noc.id === id ? { ...noc, status: "approved", rejectionReason: undefined } : noc)),
    )
    toast.success("NOC Approved", {
      description: `NOC Request ID: ${id} has been approved.`,
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
    setNocRequests((prev) => prev.map((noc) => (noc.id === id ? { ...noc, status: "rejected", rejectionReason } : noc)))
    toast.error("NOC Rejected", {
      description: `NOC Request ID: ${id} has been rejected.`,
    })
    setIsDialogOpen(false)
    setRejectionReason("")
  }

  const openDetailsDialog = (noc: NOCRequest) => {
    setSelectedNOC(noc)
    setRejectionReason(noc.rejectionReason || "")
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: NOCRequest["status"]) => {
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

  const getFilteredNOCs = (filterStatus: string) => {
    if (filterStatus === "all") {
      return nocRequests
    }
    return nocRequests.filter((noc) => {
      if (filterStatus === "pending") {
        return noc.status === "pending_teacher" || noc.status === "pending_tpo"
      }
      return noc.status === filterStatus
    })
  }

  const [activeTab, setActiveTab] = useState("pending")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>NOC Request Management</CardTitle>
        <CardDescription>Review and manage No Objection Certificate requests from students.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant={activeTab === "pending" ? "default" : "outline"} onClick={() => setActiveTab("pending")}>
            Pending ({getFilteredNOCs("pending").length})
          </Button>
          <Button variant={activeTab === "approved" ? "default" : "outline"} onClick={() => setActiveTab("approved")}>
            Approved ({getFilteredNOCs("approved").length})
          </Button>
          <Button variant={activeTab === "rejected" ? "default" : "outline"} onClick={() => setActiveTab("rejected")}>
            Rejected ({getFilteredNOCs("rejected").length})
          </Button>
          <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>
            All ({getFilteredNOCs("all").length})
          </Button>
        </div>

        {getFilteredNOCs(activeTab).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No NOC requests in this category.</p>
        ) : (
          <div className="grid gap-4">
            {getFilteredNOCs(activeTab).map((noc) => (
              <Card key={noc.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <User className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{noc.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {noc.internshipRole} at {noc.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground">Submitted: {noc.submittedDate}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end md:items-center gap-2">
                  {getStatusBadge(noc.status)}
                  <Button variant="outline" size="sm" onClick={() => openDetailsDialog(noc)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {selectedNOC && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>NOC Request Details</DialogTitle>
              <DialogDescription>
                Review the No Objection Certificate request from {selectedNOC.studentName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                  <p className="font-semibold">{selectedNOC.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Email</p>
                  <p className="font-semibold flex items-center gap-1">
                    {selectedNOC.studentEmail} <Mail className="h-4 w-4" />
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                <p className="font-semibold flex items-center gap-1">
                  {selectedNOC.companyName} <Briefcase className="h-4 w-4" />
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Internship Role & Duration</p>
                <p className="font-semibold flex items-center gap-1">
                  {selectedNOC.internshipRole} ({selectedNOC.internshipDuration}) <Calendar className="h-4 w-4" />
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Supporting Documents</h4>
                {selectedNOC.documents.length > 0 ? (
                  <div className="grid gap-2">
                    {selectedNOC.documents.map((doc, index) => (
                      <Button key={index} variant="outline" asChild className="justify-start bg-transparent">
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {doc.split("/").pop()} {/* Display file name */}
                        </a>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents provided.</p>
                )}
              </div>
              <Separator />
              {selectedNOC.teacherComments && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" /> Teacher Comments
                  </h4>
                  <p className="text-sm text-muted-foreground italic">{selectedNOC.teacherComments}</p>
                </div>
              )}
              {selectedNOC.status === "rejected" && selectedNOC.rejectionReason && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Rejection Reason</h4>
                  <p className="text-sm text-red-500 italic">{selectedNOC.rejectionReason}</p>
                </div>
              )}
              {(selectedNOC.status === "pending_tpo" || selectedNOC.status === "approved_teacher") && (
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
              {(selectedNOC.status === "pending_tpo" || selectedNOC.status === "approved_teacher") && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedNOC.id)}
                    disabled={!rejectionReason.trim()}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button onClick={() => handleApprove(selectedNOC.id)}>
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
