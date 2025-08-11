"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Search,
  Calendar,
  Building2,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { getTeacherNOCRequests, updateTeacherNOCStatus } from "@/lib/supabase-teacher"

interface NOCManagementProps {
  activeView: string
}

export function NOCManagement({ activeView }: NOCManagementProps) {
  const [nocs, setNocs] = useState<any[]>([])
  const [filteredNocs, setFilteredNocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNoc, setSelectedNoc] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    fetchNocs()
  }, [activeView])

  useEffect(() => {
    filterNocs()
  }, [nocs, searchTerm, statusFilter, activeView])

  const fetchNocs = async () => {
    try {
      setLoading(true)
      let status = "all"

      switch (activeView) {
        case "pending-nocs":
          status = "pending"
          break
        case "approved-nocs":
          status = "approved"
          break
        case "rejected-nocs":
          status = "rejected"
          break
        default:
          status = "all"
      }

      const data = await getTeacherNOCRequests(status)
      setNocs(data)
    } catch (error) {
      console.error("Error fetching NOCs:", error)
      toast.error("Failed to fetch NOC requests")
    } finally {
      setLoading(false)
    }
  }

  const filterNocs = () => {
    let filtered = [...nocs]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (noc: any) =>
          noc.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          noc.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          noc.internship_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          noc.enrollment_no?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status (for all-nocs view)
    if (statusFilter !== "all" && activeView === "all-nocs") {
      if (statusFilter === "pending") {
        filtered = filtered.filter((noc: any) => noc.status === "pending_teacher")
      } else if (statusFilter === "approved") {
        filtered = filtered.filter((noc: any) => noc.status === "approved")
      } else if (statusFilter === "rejected") {
        filtered = filtered.filter((noc: any) => noc.status === "rejected_teacher")
      }
    }

    setFilteredNocs(filtered)
  }

  const handleApprove = async (nocId: string) => {
    try {
      setActionLoading(true)
      await updateTeacherNOCStatus(nocId, "approved")

      toast.success("NOC request approved successfully! 🎉")
      fetchNocs()
      setDetailsOpen(false)
    } catch (error) {
      console.error("Error approving NOC:", error)
      toast.error("Failed to approve NOC request")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (nocId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    try {
      setActionLoading(true)
      await updateTeacherNOCStatus(nocId, "rejected_teacher", rejectionReason)

      toast.success("NOC request rejected")
      fetchNocs()
      setDetailsOpen(false)
      setRejectionReason("")
    } catch (error) {
      console.error("Error rejecting NOC:", error)
      toast.error("Failed to reject NOC request")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_teacher":
      case "pending_tpo":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected_teacher":
      case "rejected_tpo":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getViewTitle = () => {
    switch (activeView) {
      case "all-nocs":
        return "All NOC Requests"
      case "pending-nocs":
        return "Pending NOC Requests"
      case "approved-nocs":
        return "Approved NOC Requests"
      case "rejected-nocs":
        return "Rejected NOC Requests"
      default:
        return "NOC Requests"
    }
  }

  const getViewDescription = () => {
    switch (activeView) {
      case "all-nocs":
        return "View and manage all NOC requests from students"
      case "pending-nocs":
        return "Review and approve pending NOC requests"
      case "approved-nocs":
        return "View all approved NOC requests and download PDFs"
      case "rejected-nocs":
        return "View rejected NOC requests and reasons"
      default:
        return "Manage NOC requests"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            {getViewTitle()}
          </h2>
          <p className="text-gray-600 mt-1">{getViewDescription()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNocs}
            disabled={loading}
            className="hover:bg-gray-50 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 shadow-lg">
            <FileText className="w-4 h-4 mr-2" />
            {filteredNocs.length} Total
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search NOCs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by student name, company, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            {activeView === "all-nocs" && (
              <div className="w-full sm:w-48">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NOCs Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          {filteredNocs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No NOC requests found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No NOC requests available for this view"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Student</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Position</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Requested</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNocs.map((noc: any) => (
                    <TableRow
                      key={noc.id}
                      className="hover:bg-emerald-50/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedNoc(noc)
                        setDetailsOpen(true)
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{noc.profiles?.name || "Unknown"}</p>
                            <p className="text-sm text-gray-500">{noc.profiles?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{noc.company_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{noc.internship_role}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(noc.start_date)} - {formatDate(noc.end_date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(noc.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{formatDate(noc.created_at)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedNoc(noc)
                              setDetailsOpen(true)
                            }}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {noc.status === "approved" && (
                            <Button variant="ghost" size="sm" className="hover:bg-green-50">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              NOC Request Details
            </DialogTitle>
            <DialogDescription>Review and manage this NOC request</DialogDescription>
          </DialogHeader>

          {selectedNoc && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Student Name</Label>
                  <p className="text-sm font-semibold text-gray-900">{selectedNoc.profiles?.name || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-700">{selectedNoc.profiles?.email}</p>
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                  <p className="text-sm font-semibold text-gray-900">{selectedNoc.company_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Position</Label>
                  <p className="text-sm text-gray-700">{selectedNoc.internship_role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                  <p className="text-sm text-gray-700">{formatDate(selectedNoc.start_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">End Date</Label>
                  <p className="text-sm text-gray-700">{formatDate(selectedNoc.end_date)}</p>
                </div>
              </div>

              {/* Status Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">Current Status</Label>
                  {getStatusBadge(selectedNoc.status)}
                </div>
                <p className="text-sm text-gray-600">Requested on {formatDate(selectedNoc.created_at)}</p>
                {selectedNoc.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <Label className="text-sm font-medium text-red-700">Rejection Reason</Label>
                        <p className="text-sm text-red-600 mt-1">{selectedNoc.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions for Pending NOCs */}
              {selectedNoc.status === "pending_teacher" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="Provide a reason if you're rejecting this request..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-1 border-gray-200 focus:border-red-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {selectedNoc?.status === "pending_teacher" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedNoc.id)}
                  disabled={actionLoading}
                  className="shadow-lg"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedNoc.id)}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve
                </Button>
              </>
            )}
            {selectedNoc?.status === "approved" && (
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download NOC PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
