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
import { Search, Eye, Download, FileText, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface NOCRequest {
  id: string
  student_id: string
  company_name: string
  company_address: string
  internship_duration: string
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

interface NOCManagementProps {
  activeView: string
}

export function NOCManagement({ activeView }: NOCManagementProps) {
  const [nocs, setNocs] = useState<NOCRequest[]>([])
  const [filteredNocs, setFilteredNocs] = useState<NOCRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNoc, setSelectedNoc] = useState<NOCRequest | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<"approved" | "rejected">("approved")
  const [reviewComments, setReviewComments] = useState("")

  useEffect(() => {
    fetchNocs()
  }, [])

  useEffect(() => {
    filterNocs()
  }, [nocs, searchTerm, statusFilter, activeView])

  const fetchNocs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("noc_requests")
        .select(`
          *,
          profiles!inner(name, email, phone)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setNocs(data || [])
    } catch (error) {
      console.error("Error fetching NOCs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch NOC requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterNocs = () => {
    let filtered = nocs

    // Filter by active view
    if (activeView !== "all-nocs") {
      const status = activeView.replace("-nocs", "")
      filtered = filtered.filter((noc) => noc.status === status)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (noc) =>
          noc.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          noc.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          noc.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((noc) => noc.status === statusFilter)
    }

    setFilteredNocs(filtered)
  }

  const handleReview = async () => {
    if (!selectedNoc) return

    try {
      const { error } = await supabase
        .from("noc_requests")
        .update({
          status: reviewStatus,
          updated_at: new Date().toISOString(),
          // You might want to add a comments field to your database
        })
        .eq("id", selectedNoc.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `NOC request ${reviewStatus} successfully`,
      })

      setReviewDialog(false)
      setSelectedNoc(null)
      setReviewComments("")
      fetchNocs()
    } catch (error) {
      console.error("Error updating NOC:", error)
      toast({
        title: "Error",
        description: "Failed to update NOC request",
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
      case "pending-nocs":
        return "Pending NOC Requests"
      case "approved-nocs":
        return "Approved NOC Requests"
      case "rejected-nocs":
        return "Rejected NOC Requests"
      default:
        return "All NOC Requests"
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
          <p className="text-gray-600">Manage and review student NOC requests</p>
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
                  placeholder="Search by student name, email, or company..."
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

      {/* NOC Requests List */}
      <div className="grid gap-4">
        {filteredNocs.length > 0 ? (
          filteredNocs.map((noc) => (
            <Card key={noc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{noc.company_name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {noc.profiles?.name} ({noc.profiles?.email})
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{noc.internship_duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Period:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(noc.start_date).toLocaleDateString()} -{" "}
                          {new Date(noc.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Applied:</span>
                        <span className="ml-2 text-gray-600">{new Date(noc.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2">{getStatusBadge(noc.status)}</span>
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
                          <DialogTitle>NOC Request Details</DialogTitle>
                          <DialogDescription>Complete information about the NOC request</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-medium text-sm">Student Name</label>
                              <p className="text-gray-600">{noc.profiles?.name}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Email</label>
                              <p className="text-gray-600">{noc.profiles?.email}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Company Name</label>
                              <p className="text-gray-600">{noc.company_name}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">Duration</label>
                              <p className="text-gray-600">{noc.internship_duration}</p>
                            </div>
                          </div>
                          <div>
                            <label className="font-medium text-sm">Company Address</label>
                            <p className="text-gray-600">{noc.company_address}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-medium text-sm">Start Date</label>
                              <p className="text-gray-600">{new Date(noc.start_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="font-medium text-sm">End Date</label>
                              <p className="text-gray-600">{new Date(noc.end_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {noc.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedNoc(noc)
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No NOC requests found</h3>
              <p className="text-gray-600">
                {activeView === "all-nocs"
                  ? "No NOC requests have been submitted yet."
                  : `No ${activeView.replace("-nocs", "")} NOC requests found.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review NOC Request</DialogTitle>
            <DialogDescription>Review and update the status of this NOC request</DialogDescription>
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
              <Button onClick={handleReview}>{reviewStatus === "approved" ? "Approve" : "Reject"} Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
