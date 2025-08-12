"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, FileText, User, Building, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface InternshipApplication {
  id: string
  student_id: string
  company_name: string
  position: string
  location: string
  duration: string
  start_date: string
  end_date: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    email: string
    phone?: string
  }
}

interface ApplicationManagementProps {
  activeView: string
}

export function ApplicationManagement({ activeView }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<InternshipApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<InternshipApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<"approved" | "rejected">("approved")
  const [reviewComments, setReviewComments] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, activeView])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("internship_applications")
        .select(`
          *,
          profiles!inner(name, email, phone)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setApplications(data || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch internship applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Filter by active view
    if (activeView !== "all-applications") {
      const status = activeView.replace("-applications", "")
      filtered = filtered.filter((app) => app.status === status)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const handleReview = async () => {
    if (!selectedApplication) return

    try {
      const { error } = await supabase
        .from("internship_applications")
        .update({
          status: reviewStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedApplication.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Application ${reviewStatus} successfully`,
      })

      setReviewDialog(false)
      setSelectedApplication(null)
      setReviewComments("")
      fetchApplications()
    } catch (error) {
      console.error("Error updating application:", error)
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getViewTitle = () => {
    switch (activeView) {
      case "pending-applications":
        return "Pending Applications"
      case "approved-applications":
        return "Approved Applications"
      case "rejected-applications":
        return "Rejected Applications"
      default:
        return "All Applications"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h1>
          <p className="text-gray-600">Review and manage student internship applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by student name, company, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Building className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{application.position}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {application.profiles?.name} ({application.profiles?.email})
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Company:</span>
                        <span className="ml-2 text-gray-600">{application.company_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2 text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {application.location}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{application.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Period:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(application.start_date).toLocaleDateString()} -{" "}
                          {new Date(application.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Applied:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(application.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2">{getStatusBadge(application.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Application Details</DialogTitle>
                          <DialogDescription>Complete information about the internship application</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-medium text-sm">Student Name</label>
                              <p className="text-gray-600">{application.profiles?.name}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Email</label>
                              <p className="text-gray-600">{application.profiles?.email}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Company</label>
                              <p className="text-gray-600">{application.company_name}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Position</label>
                              <p className="text-gray-600">{application.position}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Location</label>
                              <p className="text-gray-600">{application.location}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Duration</label>
                              <p className="text-gray-600">{application.duration}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-medium text-sm">Start Date</label>
                              <p className="text-gray-600">{new Date(application.start_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">End Date</label>
                              <p className="text-gray-600">{new Date(application.end_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {application.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application)
                          setReviewDialog(true)
                        }}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {activeView === "all-applications"
                  ? "No internship applications have been submitted yet."
                  : `No ${activeView.replace("-applications", "")} applications found.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Review and update the status of this internship application</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Decision</label>
              <Select value={reviewStatus} onValueChange={(value: "approved" | "rejected") => setReviewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Comments (Optional)</label>
              <Textarea
                placeholder="Add any comments or feedback..."
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReview}>{reviewStatus === "approved" ? "Approve" : "Reject"} Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
