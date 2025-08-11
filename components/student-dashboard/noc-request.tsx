"use client"

// import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import { toast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2, FileText, Calendar, Building2, Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface NOCRequest {
  id: string
  company_name: string
  position: string
  start_date: string
  end_date: string
  status: "pending" | "approved" | "rejected"
  file_url: string | null
  requested_at: string
  approved_at: string | null
}

interface NOCFormData {
  company_name: string
  position: string
  start_date: string
  end_date: string
  file_url: string
}

export function NOCRequest() {
  const [requests, setRequests] = useState<NOCRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingRequest, setEditingRequest] = useState<NOCRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<NOCFormData>({
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
    file_url: "",
  })

  useEffect(() => {
    fetchNOCRequests()
  }, [])

  const fetchNOCRequests = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("noc_requests")
        .select("*")
        .eq("student_id", user.id)
        .order("requested_at", { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (error) {
      console.error("Error fetching NOC requests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch NOC requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.company_name || !formData.position || !formData.start_date || !formData.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      if (editingRequest) {
        const { error } = await supabase
          .from("noc_requests")
          .update({
            company_name: formData.company_name,
            position: formData.position,
            start_date: formData.start_date,
            end_date: formData.end_date,
            file_url: formData.file_url || null,
          })
          .eq("id", editingRequest.id)

        if (error) throw error

        toast({
          title: "Success! 🎉",
          description: "NOC request updated successfully",
        })
      } else {
        const { error } = await supabase.from("noc_requests").insert({
          student_id: user.id,
          company_name: formData.company_name,
          position: formData.position,
          start_date: formData.start_date,
          end_date: formData.end_date,
          file_url: formData.file_url || null,
        })

        if (error) throw error

        toast({
          title: "Success! 🎉",
          description: "NOC request submitted successfully",
        })
      }

      resetForm()
      setIsDialogOpen(false)
      fetchNOCRequests()
    } catch (error) {
      console.error("Error submitting NOC request:", error)
      toast({
        title: "Error",
        description: "Failed to submit NOC request",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (request: NOCRequest) => {
    setEditingRequest(request)
    setFormData({
      company_name: request.company_name,
      position: request.position,
      start_date: request.start_date,
      end_date: request.end_date,
      file_url: request.file_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this NOC request?")) return

    try {
      const { error } = await supabase.from("noc_requests").delete().eq("id", requestId)

      if (error) throw error

      toast({
        title: "Success",
        description: "NOC request deleted successfully",
      })
      fetchNOCRequests()
    } catch (error) {
      console.error("Error deleting NOC request:", error)
      toast({
        title: "Error",
        description: "Failed to delete NOC request",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      company_name: "",
      position: "",
      start_date: "",
      end_date: "",
      file_url: "",
    })
    setEditingRequest(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileUrl = (filePath: string) => {
    if (!filePath) return ""
    if (filePath.startsWith("http")) return filePath
    return supabase.storage.from("noc-documents").getPublicUrl(filePath).data.publicUrl
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">NOC Requests</h2>
        </div>
        <div className="grid gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">NOC Requests</h2>
          <p className="text-gray-600 mt-2">Manage your No Objection Certificate requests</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New NOC Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingRequest ? "Edit NOC Request" : "New NOC Request"}
              </DialogTitle>
              <DialogDescription>Submit a request for No Objection Certificate for your internship</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
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
              <EnhancedFileUpload
                bucket="noc-documents"
                path="requests"
                onUploadComplete={(url) => setFormData({ ...formData, file_url: url })}
                currentFile={formData.file_url}
                label="Offer Letter (Optional)"
                accept=".pdf,.doc,.docx"
                maxSize={10}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : editingRequest ? "Update Request" : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mx-auto mb-6">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No NOC requests yet</h3>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create NOC Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-xl">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      {request.company_name}
                    </CardTitle>
                    <CardDescription>{request.position}</CardDescription>
                  </div>
                  <div>{getStatusBadge(request.status)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p>{formatDate(request.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p>{formatDate(request.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Requested</p>
                    <p>{formatDate(request.requested_at)}</p>
                  </div>
                  {request.approved_at && (
                    <div>
                      <p className="text-sm font-medium">Approved</p>
                      <p>{formatDate(request.approved_at)}</p>
                    </div>
                  )}
                </div>

                {request.file_url && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Offer letter attached</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={getFileUrl(request.file_url)} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => handleEdit(request)} disabled={request.status === "approved"}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(request.id)} disabled={request.status === "approved"}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
