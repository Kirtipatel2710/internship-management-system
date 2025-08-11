"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, UploadCloud, Download, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/sonner"

interface Certificate {
  id: string
  title: string
  issuer: string
  fileUrl: string
  status: "pending" | "approved" | "rejected"
  uploadedAt: string
}

const dummyCertificates: Certificate[] = [
  {
    id: "cert1",
    title: "Web Development Fundamentals",
    issuer: "Coursera",
    fileUrl: "/placeholder.pdf",
    status: "approved",
    uploadedAt: "2023-01-15",
  },
  {
    id: "cert2",
    title: "Data Science with Python",
    issuer: "Udemy",
    fileUrl: "/placeholder.pdf",
    status: "pending",
    uploadedAt: "2023-03-20",
  },
  {
    id: "cert3",
    title: "Cloud Computing Basics",
    issuer: "AWS Educate",
    fileUrl: "/placeholder.pdf",
    status: "rejected",
    uploadedAt: "2023-05-10",
  },
]

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>(dummyCertificates)
  const [newCertificateTitle, setNewCertificateTitle] = useState("")
  const [newCertificateIssuer, setNewCertificateIssuer] = useState("")
  const [newCertificateFile, setNewCertificateFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewCertificateFile(event.target.files[0])
    }
  }

  const handleUploadCertificate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCertificateTitle || !newCertificateIssuer || !newCertificateFile) {
      toast.error("Missing Information", {
        description: "Please fill in all fields and select a file.",
      })
      return
    }

    // Simulate file upload and getting a URL
    const simulatedFileUrl = `/uploads/${newCertificateFile.name}` // In a real app, this would be a cloud storage URL

    const newCert: Certificate = {
      id: `cert${certificates.length + 1}`,
      title: newCertificateTitle,
      issuer: newCertificateIssuer,
      fileUrl: simulatedFileUrl,
      status: "pending",
      uploadedAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    }

    setCertificates([...certificates, newCert])
    toast.success("Certificate Uploaded", {
      description: `${newCertificateTitle} has been submitted for review.`,
    })
    setNewCertificateTitle("")
    setNewCertificateIssuer("")
    setNewCertificateFile(null)
  }

  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id))
    toast.info("Certificate Deleted", {
      description: "The certificate has been removed.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Certificates</CardTitle>
        <CardDescription>Manage and upload your internship and course completion certificates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload New Certificate</h3>
          <form onSubmit={handleUploadCertificate} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="certificateTitle">Certificate Title</Label>
                <Input
                  id="certificateTitle"
                  placeholder="e.g., Full Stack Web Development"
                  value={newCertificateTitle}
                  onChange={(e) => setNewCertificateTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="certificateIssuer">Issuing Organization</Label>
                <Input
                  id="certificateIssuer"
                  placeholder="e.g., Google, Coursera, University"
                  value={newCertificateIssuer}
                  onChange={(e) => setNewCertificateIssuer(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="certificateFile">Certificate File (PDF only)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <UploadCloud className="w-6 h-6 mb-1 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
              </div>
              {newCertificateFile && (
                <p className="text-sm text-muted-foreground mt-1">Selected: {newCertificateFile.name}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Upload Certificate
            </Button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Certificates</h3>
          {certificates.length === 0 ? (
            <p className="text-muted-foreground text-center">No certificates uploaded yet.</p>
          ) : (
            <div className="grid gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">{cert.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer} - Uploaded: {cert.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.status === "approved" && (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approved
                      </span>
                    )}
                    {cert.status === "pending" && (
                      <span className="flex items-center text-orange-500 text-sm">
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Pending
                      </span>
                    )}
                    {cert.status === "rejected" && (
                      <span className="flex items-center text-red-500 text-sm">
                        <XCircle className="h-4 w-4 mr-1" /> Rejected
                      </span>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-5 w-5" />
                        <span className="sr-only">Download Certificate</span>
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCertificate(cert.id)}>
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <span className="sr-only">Delete Certificate</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
