"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase, uploadFile, type Certificate } from "@/lib/supabase"
import { Award, Plus, Download, CheckCircle, Clock, XCircle, Upload } from "lucide-react"
import { toast } from "sonner"

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    internship_title: "",
    company_name: "",
    notes: "",
  })
  const [certificateFile, setCertificateFile] = useState<File | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Authentication Error", {
          description: "Please log in to view certificates"
        })
        return
      }

      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false })

      if (error) throw error

      setCertificates(data || [])
    } catch (error) {
      console.error("Error fetching certificates:", error)
      toast.error("Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.internship_title.trim()) {
      toast.warning("Missing Required Field", {
        description: "Please enter the internship title",
      })
      return false
    }

    if (!formData.company_name.trim()) {
      toast.warning("Missing Required Field", {
        description: "Please enter the company name",
      })
      return false
    }

    if (!certificateFile) {
      toast.warning("File Required", {
        description: "Please upload your completion certificate",
      })
      return false
    }

    return true
  }

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid File Type", {
        description: "Please upload PDF, JPG, or PNG files only",
      })
      return null
    }

    if (file.size > maxSize) {
      toast.error("File Too Large", {
        description: "File size must be less than 10MB",
      })
      return null
    }

    try {
      setUploading(true)
      
      // Generate a unique file path to prevent naming conflicts
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `completion-certificates/${fileName}`
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("completion-certificates")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error("Supabase storage upload error:", error)
        toast.error("Upload Failed", {
          description: `Failed to upload certificate: ${error.message}`,
        })
        return null
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("completion-certificates")
        .getPublicUrl(filePath)
      
      if (!publicUrlData?.publicUrl) {
        toast.error("Upload Error", {
          description: "Could not generate public URL for uploaded file"
        })
        return null
      }

      return publicUrlData.publicUrl

    } catch (error) {
      console.error("File upload error:", error)
      toast.error("Upload Failed", {
        description: "An unexpected error occurred during file upload"
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Authentication Error", {
          description: "Please log in to submit certificates"
        })
        return
      }

      // Upload the certificate file first
      const fileUrl = await handleFileUpload(certificateFile!)
      
      if (!fileUrl) {
        // Error already handled in handleFileUpload
        return
      }

      // Insert certificate record into database
      const certificateData = {
        student_id: user.id,
        internship_title: formData.internship_title.trim(),
        company_name: formData.company_name.trim(),
        notes: formData.notes.trim() || null,
        file_url: fileUrl,
        status: 'pending', // Based on your schema CHECK constraint
        title: formData.internship_title.trim(), // Added as per schema
        issuer: formData.company_name.trim(), // Added as per schema
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from("certificates")
        .insert(certificateData)
        .select()

      if (error) {
        console.error("Database insert error:", error)
        
        // If database insert fails, try to clean up the uploaded file
        try {
          const filePath = fileUrl.split('/').pop()
          if (filePath) {
            await supabase.storage
              .from("completion-certificates")
              .remove([`completion-certificates/${filePath}`])
          }
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded file:", cleanupError)
        }

        throw error
      }

      toast.success("Certificate Submitted!", {
        description: "Your certificate has been submitted for review",
      })

      // Reset form and close dialog
      setFormData({
        internship_title: "",
        company_name: "",
        notes: "",
      })
      setCertificateFile(null)
      setIsDialogOpen(false)
      
      // Refresh the certificates list
      await fetchCertificates()

    } catch (error: any) {
      console.error("Error submitting certificate:", error)
      
      let errorMessage = "Failed to submit certificate"
      if (error?.message) {
        errorMessage += `: ${error.message}`
      }
      
      toast.error("Submission Failed", {
        description: errorMessage
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadCertificate = (fileUrl: string, fileName: string) => {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = fileUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      // For better UX, you might want to add download attribute
      // link.download = fileName
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading certificate:", error)
      toast.error("Download Failed", {
        description: "Could not open certificate file"
      })
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
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600">Upload and manage your internship completion certificates</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Completion Certificate</DialogTitle>
              <DialogDescription>Submit your internship completion certificate for verification</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="internship_title">Internship Title *</Label>
                  <Input
                    id="internship_title"
                    value={formData.internship_title}
                    onChange={(e) => setFormData({ ...formData, internship_title: e.target.value })}
                    placeholder="e.g., Software Development Intern"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g., Tech Solutions Inc."
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certificate_file">Certificate File * (PDF, JPG, PNG - Max 10MB)</Label>
                <Input
                  id="certificate_file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                  className="mt-1"
                  required
                />
                {certificateFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {certificateFile.name} ({(certificateFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information about the certificate..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting || uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || uploading}>
                  {submitting || uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {uploading ? "Uploading..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">Uploaded certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.filter((c) => c.status === "approved").length}</div>
            <p className="text-xs text-muted-foreground">Verified certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.filter((c) => c.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((certificate) => {
          const statusInfo = statusConfig[certificate.status as keyof typeof statusConfig]
          const StatusIcon = statusInfo?.icon || Clock

          return (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{certificate.internship_title || certificate.title}</CardTitle>
                    <CardDescription className="mt-1">{certificate.company_name || certificate.issuer}</CardDescription>
                  </div>
                  <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
                    <div className="flex items-center">
                      <StatusIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">{statusInfo?.label || "Unknown"}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {certificate.notes && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Notes:</h4>
                    <p className="text-sm text-gray-600">{certificate.notes}</p>
                  </div>
                )}

                {certificate.rejection_reason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-sm text-red-900 mb-1">Rejection Reason:</h4>
                    <p className="text-sm text-red-800">{certificate.rejection_reason}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Submitted: {new Date(certificate.submitted_at || certificate.created_at).toLocaleDateString()}
                    {certificate.approved_at && (
                      <span className="block">Approved: {new Date(certificate.approved_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDownloadCertificate(
                      certificate.file_url, 
                      `${certificate.internship_title || certificate.title}_certificate`
                    )}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {certificates.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-500 mb-4">Upload your internship completion certificates for verification.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload First Certificate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}