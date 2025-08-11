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
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Building2,
  User,
  MapPin,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { getTeacherInternshipApplications, updateTeacherApplicationStatus } from "@/lib/supabase-teacher"

interface ApplicationManagementProps {
  activeView: string
}

export function ApplicationManagement({ activeView }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [activeView])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, activeView])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      let status = "all"

      switch (activeView) {
        case "pending-applications":
          status = "pending"
          break
        case "approved-applications":
          status = "approved"
          break
        case "rejected-applications":
          status = "rejected"
          break
        default:
          status = "all"
      }

      const data = await getTeacherInternshipApplications(status)
      setApplications(data)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to fetch internship applications")
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app: any) =>
          app.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.internship_opportunities?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.internship_opportunities?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status (for all-applications view)
    if (statusFilter !== "all" && activeView === "all-applications") {
      if (statusFilter === "pending") {
        filtered = filtered.filter((app: any) => app.status === "pending_teacher")
      } else if (statusFilter === "approved") {
        filtered = filtered.filter((app: any) => app.status === "approved")
      } else if (statusFilter === "rejected") {
        filtered = filtered.filter((app: any) => app.status === "rejected_teacher")
      }
    }

    setFilteredApplications(filtered)
  }

  const handleApprove = async (applicationId: string) => {
    try {
      setActionLoading(true)
      await updateTeacherApplicationStatus(applicationId, "approved")

      toast.success("Internship application approved successfully! 🎉")
      fetchApplications()
      setDetailsOpen(false)
    } catch (error) {
      console.error("Error approving application:", error)
      toast.error("Failed to approve application")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (applicationId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    try {
      setActionLoading(true)
      await updateTeacherApplicationStatus(applicationId, "rejected_teacher", rejectionReason)

      toast.success("Application has been rejected")
      fetchApplications()
      setDetailsOpen(false)
      setRejectionReason("")
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast.error("Failed to reject application")
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
      case "all-applications":
        return "All Internship Applications"
      case "pending-applications":
        return "Pending Applications"
      case "approved-applications":
        return "Approved Applications"
      case "rejected-applications":
        return "Rejected Applications"
      default:
        return "Internship Applications"
    }
  }

  const getViewDescription = () => {
    switch (activeView) {
      case "all-applications":
        return "View and manage all internship applications from students"
      case "pending-applications":
        return "Review and approve pending internship applications"
      case "approved-applications":
        return "View all approved internship applications"
      case "rejected-applications":
        return "View rejected applications and reasons"
      default:
        return "Manage internship applications"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {getViewTitle()}
          </h2>
          <p className="text-gray-600 mt-1">{getViewDescription()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            disabled={loading}
            className="hover:bg-gray-50 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 shadow-lg">
            <Users className="w-4 h-4 mr-2" />
            {filteredApplications.length} Total
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Applications</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by student name, company, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            {activeView === "all-applications" && (
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

      {/* Applications Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No applications available for this view"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Student</TableHead>
                    <TableHead className="font-semibold">Opportunity</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Mode</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Applied</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app: any) => (
                    <TableRow
                      key={app.id}
                      className="hover:bg-purple-50/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedApplication(app)
                        setDetailsOpen(true)
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.profiles?.name || "Unknown"}</p>
                            <p className="text-sm text-gray-500">{app.profiles?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {app.internship_opportunities?.title || "Unknown Position"}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {app.internship_opportunities?.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {app.internship_opportunities?.company_name || "Unknown Company"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={app.internship_opportunities?.mode === "online" ? "secondary" : "outline"}>
                          {app.internship_opportunities?.mode || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{formatDate(app.created_at)}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedApplication(app)
                            setDetailsOpen(true)
                          }}
                          className="hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
              <Users className="h-5 w-5 text-purple-600" />
              Application Details
            </DialogTitle>
            <DialogDescription>Review and manage this internship application</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Student Name</Label>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedApplication.profiles?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-700">{selectedApplication.profiles?.email}</p>
                </div>
              </div>

              {/* Opportunity Information */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Position</Label>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedApplication.internship_opportunities?.title}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Company</Label>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedApplication.internship_opportunities?.company_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Location</Label>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {selectedApplication.internship_opportunities?.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Stipend</Label>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {selectedApplication.internship_opportunities?.stipend || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedApplication.internship_opportunities?.description}
                  </p>
                </div>
              </div>

              {/* Application Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">Current Status</Label>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                <p className="text-sm text-gray-600">Applied on {formatDate(selectedApplication.created_at)}</p>
                {selectedApplication.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <Label className="text-sm font-medium text-red-700">Rejection Reason</Label>
                        <p className="text-sm text-red-600 mt-1">{selectedApplication.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions for Pending Applications */}
              {selectedApplication.status === "pending_teacher" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="Provide a reason if you're rejecting this application..."
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
            {selectedApplication?.status === "pending_teacher" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedApplication.id)}
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
                  onClick={() => handleApprove(selectedApplication.id)}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
