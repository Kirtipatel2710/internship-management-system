"use client"

import { Separator } from "@/components/ui/separator"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Building2, Mail, Phone, Globe, MapPin, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"

interface Company {
  id: string
  name: string
  industry: string
  website: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  address: string
  description: string
  status: "pending" | "verified" | "rejected"
  documents: string[]
  rejectionReason?: string
}

const dummyCompanies: Company[] = [
  {
    id: "comp1",
    name: "InnovateX Solutions",
    industry: "Software Development",
    website: "https://innovatex.com",
    contactPerson: "Alice Wonderland",
    contactEmail: "alice@innovatex.com",
    contactPhone: "+1-555-123-4567",
    address: "123 Tech Park, Bengaluru, India",
    description: "Leading software company specializing in AI and cloud solutions.",
    status: "pending",
    documents: ["/placeholder.pdf?query=InnovateX_Registration.pdf", "/placeholder.pdf?query=InnovateX_Tax_ID.pdf"],
  },
  {
    id: "comp2",
    name: "Green Energy Corp",
    industry: "Renewable Energy",
    website: "https://greenenergy.com",
    contactPerson: "Bob The Builder",
    contactEmail: "bob@greenenergy.com",
    contactPhone: "+1-555-987-6543",
    address: "456 Eco Lane, Delhi, India",
    description: "Pioneering sustainable energy solutions for a greener future.",
    status: "verified",
    documents: ["/placeholder.pdf?query=GreenEnergy_License.pdf"],
  },
  {
    id: "comp3",
    name: "Future EdTech",
    industry: "Education Technology",
    website: "https://futureedtech.com",
    contactPerson: "Charlie Chaplin",
    contactEmail: "charlie@futureedtech.com",
    contactPhone: "+1-555-111-2222",
    address: "789 Learning Blvd, Pune, India",
    description: "Developing innovative e-learning platforms and educational tools.",
    status: "rejected",
    documents: ["/placeholder.pdf?query=FutureEdTech_Profile.pdf"],
    rejectionReason: "Missing valid business registration documents.",
  },
]

export function CompanyVerification() {
  const [companies, setCompanies] = useState<Company[]>(dummyCompanies)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleVerify = (id: string) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, status: "verified", rejectionReason: undefined } : comp)),
    )
    toast.success("Company Verified", {
      description: `Company ID: ${id} has been successfully verified.`,
    })
    setIsDialogOpen(false)
  }

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection Reason Required", {
        description: "Please provide a reason for rejection.",
      })
      return
    }
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, status: "rejected", rejectionReason } : comp)),
    )
    toast.error("Company Rejected", {
      description: `Company ID: ${id} has been rejected.`,
    })
    setIsDialogOpen(false)
    setRejectionReason("")
  }

  const openDetailsDialog = (company: Company) => {
    setSelectedCompany(company)
    setRejectionReason(company.rejectionReason || "")
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: Company["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pending
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Verification</CardTitle>
        <CardDescription>Review and verify companies requesting to post internships.</CardDescription>
      </CardHeader>
      <CardContent>
        {companies.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No companies to verify at the moment.</p>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end md:items-center gap-2">
                  {getStatusBadge(company.status)}
                  <Button variant="outline" size="sm" onClick={() => openDetailsDialog(company)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {selectedCompany && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Company Details: {selectedCompany.name}</DialogTitle>
              <DialogDescription>Review the company information and documents for verification.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Industry</p>
                  <p className="font-semibold">{selectedCompany.industry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {selectedCompany.website} <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCompany.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCompany.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-full">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCompany.address}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedCompany.description}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Supporting Documents</h4>
                {selectedCompany.documents.length > 0 ? (
                  <div className="grid gap-2">
                    {selectedCompany.documents.map((doc, index) => (
                      <Button key={index} variant="outline" asChild className="justify-start bg-transparent">
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {doc.split("/").pop()} {/* Display file name */}
                        </a>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents provided.</p>
                )}
              </div>
              {selectedCompany.status === "rejected" && selectedCompany.rejectionReason && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Rejection Reason</h4>
                    <p className="text-sm text-red-500 italic">{selectedCompany.rejectionReason}</p>
                  </div>
                </>
              )}
              {selectedCompany.status !== "verified" && (
                <div className="grid gap-2">
                  <Label htmlFor="rejectionReason">Rejection Reason (Optional for Approval)</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Enter reason for rejection if applicable..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedCompany.status !== "verified" && (
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedCompany.id)}
                  disabled={selectedCompany.status === "rejected" && !rejectionReason.trim()}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
              )}
              {selectedCompany.status !== "rejected" && (
                <Button onClick={() => handleVerify(selectedCompany.id)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Verify
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
