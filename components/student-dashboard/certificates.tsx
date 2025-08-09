"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import { toast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2, Award, Calendar, MessageSquare, Eye, Building2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Certificate {
  id: string
  student_id: string
  internship_title: string
  company_name: string
  start_date: string
  end_date: string
  file_url: string
  status: "pending" | "approved" | "rejected"
  notes: string | null
  submitted_at: string
  approved_by: string | null
  approved_at: string | null
}

interface CertificateFormData {
  internship_title: string
  company_name: string
  start_date: string
  end_date: string
  file_url: string
  notes: string
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CertificateFormData>({
    internship_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    file_url: "",
    notes: "",
  })

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false })

      if (error) throw error

      setCertificates(data || [])
    } catch (error) {
      console.error("Error fetching certificates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch certificates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.internship_title ||
      !formData.company_name ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.file_url
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and upload a certificate",
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

      if (editingCertificate) {
        // Update existing certificate
        const { error } = await supabase
          .from("certificates")
          .update({
            internship_title: formData.internship_title,
            company_name: formData.company_name,
            start_date: formData.start_date,
            end_date: formData.end_date,
            file_url: formData.file_url,
            notes: formData.notes || null,
          })
          .eq("id", editingCertificate.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Certificate updated successfully",
        })
      } else {
        // Create new certificate
        const { error } = await supabase.from("certificates").insert({
          student_id: user.id,
          internship_title: formData.internship_title,
          company_name: formData.company_name,
          start_date: formData.start_date,
          end_date: formData.end_date,
          file_url: formData.file_url,
          notes: formData.notes || null,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Certificate submitted successfully",
        })
      }

      resetForm()
      setIsDialogOpen(false)
      fetchCertificates()
    } catch (error) {
      console.error("Error submitting certificate:", error)
      toast({
        title: "Error",
        description: "Failed to submit certificate",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setFormData({
      internship_title: certificate.internship_title,
      company_name: certificate.company_name,
      start_date: certificate.start_date,
      end_date: certificate.end_date,
      file_url: certificate.file_url,
      notes: certificate.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (certificateId: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return

    try {
      const { error } = await supabase.from("certificates").delete().eq("id", certificateId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Certificate deleted successfully",
      })
      fetchCertificates()
    } catch (error) {
      console.error("Error deleting certificate:", error)
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      internship_title: "",
      company_name: "",
      start_date: "",
      end_date: "",
      file_url: "",
      notes: "",
    })
    setEditingCertificate(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Internship Certificates</h2>
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Internship Certificates</h2>
          <p className="text-gray-600">Upload and manage your internship completion certificates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingCertificate ? "Edit Certificate" : "Upload Internship Certificate"}</DialogTitle>
              <DialogDescription>Submit your internship completion certificate for approval</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="internship_title">Internship Title *</Label>
                  <Input
                    id="internship_title"
                    value={formData.internship_title}
                    onChange={(e) => setFormData({ ...formData, internship_title: e.target.value })}
                    placeholder="Enter internship position title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  bucket="certificates"
                  path="completion_certificates"
                  onUploadComplete={(url) => setFormData({ ...formData, file_url: url })}
                  currentFile={formData.file_url}
                  label="Certificate File (PDF)"
                  required
                  accept=".pdf"
                  maxSize={10}
                />

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information about your internship"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !formData.file_url}>
                  {submitting ? "Uploading..." : editingCertificate ? "Update Certificate" : "Upload Certificate"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No certificates uploaded yet</h3>
            <p className="text-gray-600 mb-4">Upload your internship completion certificate to get started</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload Certificate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-orange-600" />
                      {certificate.internship_title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{certificate.company_name}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">{getStatusBadge(certificate.status)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      Duration: {formatDate(certificate.start_date)} - {formatDate(certificate.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Submitted: {formatDate(certificate.submitted_at)}</span>
                  </div>
                </div>

                {certificate.notes && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Your Notes:</p>
                        <p className="text-sm text-blue-700 mt-1">{certificate.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Award className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Certificate file attached</span>
                  <Button variant="ghost" size="sm" asChild className="ml-auto">
                    <a href={certificate.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>

                {certificate.approved_at && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Approved on {formatDate(certificate.approved_at)}
                        </p>
                        <p className="text-sm text-green-700">Your certificate has been verified and approved</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(certificate)}
                    disabled={certificate.status === "approved"}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(certificate.id)}
                    disabled={certificate.status === "approved"}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
