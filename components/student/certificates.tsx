"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Award, Download, Calendar, Building2, CheckCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface Certificate {
  id: string
  internship_title: string
  company_name: string
  start_date: string
  end_date: string
  status: "completed" | "in_progress"
  certificate_url?: string
  completion_date?: string
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch approved applications that could have certificates
      const { data, error } = await supabase
        .from("internship_applications")
        .select(`
          id,
          status,
          applied_at,
          internship_opportunities (
            title,
            start_date,
            end_date,
            companies (
              name
            )
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "approved")

      if (error) throw error

      // Transform data to certificate format
      const certificateData: Certificate[] = (data || []).map((app: any) => ({
        id: app.id,
        internship_title: app.internship_opportunities.title,
        company_name: app.internship_opportunities.companies.name,
        start_date: app.internship_opportunities.start_date || app.applied_at,
        end_date: app.internship_opportunities.end_date || new Date().toISOString(),
        status:
          new Date() > new Date(app.internship_opportunities.end_date || new Date()) ? "completed" : "in_progress",
        certificate_url: null, // Would be populated when certificate is generated
        completion_date: app.internship_opportunities.end_date,
      }))

      setCertificates(certificateData)
    } catch (error) {
      console.error("Error fetching certificates:", error)
      toast.error("Failed to load certificates")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCertificate = async (certificateId: string) => {
    try {
      // This would typically generate and download a PDF certificate
      toast.success("Certificate download started")
      // Implementation for PDF generation would go here
    } catch (error) {
      console.error("Error downloading certificate:", error)
      toast.error("Failed to download certificate")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600">Download and manage your internship certificates</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">Approved internships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.filter((c) => c.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Certificates available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.filter((c) => c.status === "in_progress").length}</div>
            <p className="text-xs text-muted-foreground">Ongoing internships</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{certificate.internship_title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {certificate.company_name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(certificate.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(certificate.status)}
                    <span className="ml-1 capitalize">{certificate.status.replace("_", " ")}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(certificate.start_date).toLocaleDateString()} -{" "}
                  {new Date(certificate.end_date).toLocaleDateString()}
                </div>
                {certificate.completion_date && (
                  <div className="text-sm">
                    <span className="font-medium">Completed:</span>{" "}
                    {new Date(certificate.completion_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {certificate.status === "completed" ? "Certificate ready" : "Internship ongoing"}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleDownloadCertificate(certificate.id)}
                  disabled={certificate.status !== "completed"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {certificate.status === "completed" ? "Download" : "Not Available"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-500">Complete your internships to earn certificates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
