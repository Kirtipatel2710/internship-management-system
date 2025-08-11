"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  Building2,
  User,
  FileText,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { getTpOfficerNOCRequests, updateTpOfficerNOCStatus } from "@/lib/supabase-tp-officer-consistent"
import { toast } from "sonner"

export function NOCManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNOC, setSelectedNOC] = useState<any>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [nocRequests, setNocRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadNOCRequests()
  }, [statusFilter])

  const loadNOCRequests = async () => {
    try {
      setIsLoading(true)
      const data = await getTpOfficerNOCRequests(statusFilter)
      setNocRequests(data)
    } catch (error) {
      console.error("Error loading NOC requests:", error)
      toast.error("Failed to load NOC requests")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRequests = nocRequests.filter((request) => {
    const matchesSearch =
      request.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.profiles?.enrollment_no?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_tpo":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Low</Badge>
      default:
        return null
    }
  }

  const handleApprove = async (nocId: string) => {
    try {
      setIsUpdating(true)
      await updateTpOfficerNOCStatus(nocId, "approved")
      toast.success("NOC request approved successfully! 🎉")
      setShowApprovalDialog(false)
      loadNOCRequests()
    } catch (error) {
      console.error("Error approving NOC:", error)
      toast.error("Failed to approve NOC request")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async (nocId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    try {
      setIsUpdating(true)
      await updateTpOfficerNOCStatus(nocId, "rejected", rejectionReason)
      toast.success("NOC request rejected")
      setShowRejectionDialog(false)
      setRejectionReason("")
      loadNOCRequests()
    } catch (error) {
      console.error("Error rejecting NOC:", error)
      toast.error("Failed to reject NOC request")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NOC Management
          </h2>
          <p className="text-gray-600 mt-1">Review and manage student NOC requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadNOCRequests}
            disabled={isLoading}
            className="hover:bg-gray-50 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 shadow-lg">
            <Clock className="w-4 h-4 mr-2" />
            {filteredRequests.filter((r) => r.status === "pending_tpo").length} Pending
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name, company, or enrollment number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
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

      {/* NOC Requests Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            NOC Requests ({filteredRequests.length})
          </CardTitle>
          <CardDescription>Click on any row to view detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Student Details</TableHead>
                    <TableHead className="font-semibold">Company & Role</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Submitted</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                      onClick={() => setSelectedNOC(request)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{request.profiles?.name || "Unknown"}</div>
                            <div className="text-sm text-gray-500">{request.profiles?.enrollment_no}</div>
                            <div className="text-sm text-gray-500">{request.profiles?.branch}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{request.company_name}</div>
                          <div className="text-sm text-gray-500">{request.internship_role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{request.internship_duration}</div>
                          <div className="text-sm text-gray-500">{request.internship_location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(request.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {request.status === "pending_tpo" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedNOC(request)
                                  setShowApprovalDialog(true)
                                }}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="shadow-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedNOC(request)
                                  setShowRejectionDialog(true)
                                }}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status === "approved" && (
                            <Button size="sm" variant="outline" className="hover:bg-gray-50 bg-transparent">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No NOC requests found</h3>
              <p className="text-gray-500">No requests match your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NOC Details Modal */}
      <Dialog open={!!selectedNOC} onOpenChange={() => setSelectedNOC(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              NOC Request Details
            </DialogTitle>
            <DialogDescription>Complete information about the NOC request</DialogDescription>
          </DialogHeader>

          {selectedNOC && (
            <div className="space-y-6">
              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedNOC.profiles?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Enrollment Number</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedNOC.profiles?.enrollment_no}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Branch</Label>
                    <p className="text-gray-700">{selectedNOC.profiles?.branch}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Year</Label>
                    <p className="text-gray-700">{selectedNOC.profiles?.year}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-gray-700">{selectedNOC.profiles?.email}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                    Company & Internship Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedNOC.company_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Role</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedNOC.internship_role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="text-gray-700">{selectedNOC.internship_location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duration</Label>
                    <p className="text-gray-700">{selectedNOC.internship_duration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                    <p className="text-gray-700">{formatDate(selectedNOC.start_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">End Date</Label>
                    <p className="text-gray-700">{formatDate(selectedNOC.end_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Stipend</Label>
                    <p className="text-gray-700">{selectedNOC.stipend || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company Contact</Label>
                    <p className="text-gray-700">{selectedNOC.company_contact_email || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="mt-1 text-gray-700">{selectedNOC.description || "No description provided"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Status and Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                        <div className="mt-1">{getStatusBadge(selectedNOC.status)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Priority</Label>
                        <div className="mt-1">{getPriorityBadge(selectedNOC.priority)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Submitted Date</Label>
                        <p className="mt-1 text-gray-700">{formatDate(selectedNOC.created_at)}</p>
                      </div>
                    </div>

                    {selectedNOC.status === "pending_tpo" && (
                      <div className="flex gap-3">
                        <Button
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                          onClick={() => setShowApprovalDialog(true)}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve NOC
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setShowRejectionDialog(true)}
                          disabled={isUpdating}
                          className="shadow-lg"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject NOC
                        </Button>
                      </div>
                    )}
                  </div>

                  {selectedNOC.status === "rejected" && selectedNOC.rejection_reason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-red-700 mt-1">{selectedNOC.rejection_reason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Approve NOC Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this NOC request? This action will generate an official NOC document.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => selectedNOC && handleApprove(selectedNOC.id)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve NOC
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Reject NOC Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this NOC request. This will be communicated to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px] border-gray-200 focus:border-red-500"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedNOC && handleReject(selectedNOC.id)}
                disabled={!rejectionReason.trim() || isUpdating}
                className="shadow-lg"
              >
                {isUpdating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject NOC
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
