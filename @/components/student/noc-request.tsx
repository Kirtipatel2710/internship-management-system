"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { FileText, Plus, Calendar, Building2, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/sonner"

type NOCRequestType = {
  id: string
  student_id: string
  company_name: string
  company_address: string
  company_contact_email: string
  company_contact_phone: string
  internship_role: string
  internship_duration: string
  internship_location: string
  start_date: string
  end_date: string
  stipend: string
  description: string
  status: string
  rejection_reason?: string
  created_at: string
}

export function NOCRequestComponent() {
  const [nocRequests, setNocRequests] = useState<NOCRequestType[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    company_name: "",
    company_address: "",
    company_contact_email: "",
    company_contact_phone: "",
    internship_role: "",
    internship_duration: "",
    internship_location: "",
    start_date: "",
    end_date: "",
    stipend: "",
    description: "",
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
        .order("created_at", { ascending: false })

      if (error) throw error

      setNocRequests(data || [])
    } catch (error) {
      console.error("Error fetching NOC requests:", error)
      toast.error("Failed to load NOC requests")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to submit NOC request")
        return
      }

      const { error } = await supabase.from("noc_requests").insert({
        student_id: user.id,
        ...formData,
        status: "pending_teacher",
      })

      if (error) throw error

      toast.success("NOC request submitted successfully!")
      setFormData({
        company_name: "",
        company_address: "",
        company_contact_email: "",
        company_contact_phone: "",
        internship_role: "",
        internship_duration: "",
        internship_location: "",
        start_date: "",
        end_date: "",
        stipend: "",
        description: "",
      })
      fetchNOCRequests()
    } catch (error) {
      console.error("Error submitting NOC request:", error)
      toast.error("Failed to submit NOC request")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_teacher":
        return "bg-yellow-100 text-yellow-800"
      case "approved_teacher":
        return "bg-blue-100 text-blue-800"
      case "rejected_teacher":
        return "bg-red-100 text-red-800"
      case "pending_tpo":
        return "bg-orange-100 text-orange-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
      case "rejected_teacher":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending_teacher":
        return "Pending Teacher Approval"
      case "approved_teacher":
        return "Teacher Approved"
      case "rejected_teacher":
        return "Teacher Rejected"
      case "pending_tpo":
        return "Pending T&P Officer Approval"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NOC Requests</h1>
          <p className="text-gray-600">Manage your No Objection Certificate requests</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New NOC Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit NOC Request</DialogTitle>
              <DialogDescription>Fill in the details for your internship NOC request</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="internship_role">Internship Role *</Label>
                  <Input
                    id="internship_role"
                    value={formData.internship_role}
                    onChange={(e) => setFormData({ ...formData, internship_role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_address">Company Address</Label>
                <Textarea
                  id="company_address"
                  value={formData.company_address}
                  onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_contact_email">Company Contact Email</Label>
                  <Input
                    id="company_contact_email"
                    type="email"
                    value={formData.company_contact_email}
                    onChange={(e) => setFormData({ ...formData, company_contact_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="company_contact_phone">Company Contact Phone</Label>
                  <Input
                    id="company_contact_phone"
                    value={formData.company_contact_phone}
                    onChange={(e) => setFormData({ ...formData, company_contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="internship_duration">Duration *</Label>
                  <Input
                    id="internship_duration"
                    placeholder="e.g., 3 months"
                    value={formData.internship_duration}
                    onChange={(e) => setFormData({ ...formData, internship_duration: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="internship_location">Location</Label>
                  <Input
                    id="internship_location"
                    value={formData.internship_location}
                    onChange={(e) => setFormData({ ...formData, internship_location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
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

              <div>
                <Label htmlFor="stipend">Stipend</Label>
                <Input
                  id="stipend"
                  placeholder="e.g., ₹15,000/month"
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the internship..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* NOC Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nocRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.internship_role}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {request.company_name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(request.status)}
                    <span className="ml-1">{formatStatus(request.status)}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {request.internship_location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {request.internship_location}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {request.internship_duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(request.start_date).toLocaleDateString()} -{" "}
                  {new Date(request.end_date).toLocaleDateString()}
                </div>
              </div>

              {request.stipend && (
                <div className="text-sm">
                  <span className="font-medium">Stipend:</span> {request.stipend}
                </div>
              )}

              {request.description && <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>}

              {request.rejection_reason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Rejection Reason:</span> {request.rejection_reason}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-400">
                Submitted on {new Date(request.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {nocRequests.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NOC requests yet</h3>
            <p className="text-gray-500 mb-4">
              Submit your first NOC request to get started with your internship process.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit NOC Request
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
