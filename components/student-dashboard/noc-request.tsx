"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Building2,
} from "lucide-react"

export function NOCRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)

  const existingRequests = [
    {
      id: 1,
      title: "Summer Internship NOC",
      company: "Tech Solutions Inc.",
      requestDate: "2024-01-15",
      status: "approved",
      approvedBy: "Dr. Smith",
      approvedDate: "2024-01-18",
      documents: ["internship-letter.pdf", "college-id.pdf"],
      remarks: "Approved for summer internship program. Good luck!",
    },
    {
      id: 2,
      title: "Part-time Internship NOC",
      company: "Analytics Pro Ltd.",
      requestDate: "2024-01-10",
      status: "pending",
      documents: ["offer-letter.pdf", "academic-transcript.pdf"],
      remarks: "Under review by T&P coordinator",
    },
    {
      id: 3,
      title: "Research Project NOC",
      company: "University Labs",
      requestDate: "2024-01-05",
      status: "rejected",
      rejectedBy: "Prof. Johnson",
      rejectedDate: "2024-01-08",
      documents: ["research-proposal.pdf"],
      remarks: "Conflicts with current semester schedule. Please reapply next semester.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "badge-success"
      case "pending":
        return "badge-warning"
      case "rejected":
        return "badge-error"
      default:
        return "badge-info"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleSubmitRequest = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowNewRequestForm(false)
    // Show success toast
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NOC Requests</h1>
                <p className="text-gray-600 text-lg">Manage your No Objection Certificate requests</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:items-end space-y-2">
            <Badge className="badge-success px-4 py-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              {existingRequests.filter((r) => r.status === "approved").length} Approved
            </Badge>
            <Button onClick={() => setShowNewRequestForm(!showNewRequestForm)} className="btn-modern">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* New Request Form */}
      {showNewRequestForm && (
        <Card className="modern-card animate-slide-up">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Submit New NOC Request</h3>
                <p className="text-gray-600">Fill out the form below to request a new NOC</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitRequest()
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Request Title</label>
                  <Input
                    placeholder="e.g., Summer Internship NOC"
                    className="glass-card border-gray-200/50 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company/Organization</label>
                  <Input
                    placeholder="e.g., Tech Solutions Inc."
                    className="glass-card border-gray-200/50 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Internship Type</label>
                  <Select required>
                    <SelectTrigger className="glass-card border-gray-200/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">Summer Internship</SelectItem>
                      <SelectItem value="winter">Winter Internship</SelectItem>
                      <SelectItem value="part-time">Part-time Internship</SelectItem>
                      <SelectItem value="full-time">Full-time Internship</SelectItem>
                      <SelectItem value="research">Research Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <Select required>
                    <SelectTrigger className="glass-card border-gray-200/50">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="2-months">2 Months</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Purpose/Description</label>
                <Textarea
                  placeholder="Describe the purpose of your internship and how it aligns with your academic goals..."
                  className="glass-card border-gray-200/50 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Upload Documents</label>
                <EnhancedFileUpload
                  onUpload={(files) => console.log("Uploaded files:", files)}
                  acceptedFileTypes={["application/pdf", "image/jpeg", "image/png"]}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  bucketName="noc-documents"
                />
                <p className="text-xs text-gray-500">
                  Upload offer letter, company details, and any other relevant documents (PDF, JPG, PNG - Max 5MB each)
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewRequestForm(false)}
                  className="btn-outline-modern flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="btn-modern flex-1">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Existing Requests */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your NOC Requests</h3>
            <p className="text-gray-600">Track the status of your submitted requests</p>
          </div>
        </div>

        <div className="grid gap-6">
          {existingRequests.map((request, index) => (
            <Card
              key={request.id}
              className="modern-card hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{request.title}</h4>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{request.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Requested: {request.requestDate}
                          </div>
                          {request.status === "approved" && request.approvedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Approved: {request.approvedDate}
                            </div>
                          )}
                          {request.status === "rejected" && request.rejectedDate && (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Rejected: {request.rejectedDate}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium">Remarks:</span> {request.remarks}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="glass-card hover:shadow-md bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {request.status === "approved" && (
                        <Button size="sm" className="btn-modern h-8 px-3 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download NOC
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="font-medium">Documents ({request.documents.length}):</p>
                      {request.documents.map((doc, idx) => (
                        <p key={idx} className="truncate">
                          {doc}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
