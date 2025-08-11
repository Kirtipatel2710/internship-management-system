"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Globe,
  Phone,
  Mail,
  FileText,
  Calendar,
  MapPin,
  Users,
  Star,
  AlertTriangle,
} from "lucide-react"

export function CompanyVerification() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const companies = [
    {
      id: 1,
      name: "InnovateTech Solutions",
      website: "https://innovatetech.com",
      industry: "Software Development",
      contactPerson: "Mr. Rajesh Kumar",
      designation: "HR Manager",
      email: "hr@innovatetech.com",
      phone: "+91 9876543210",
      address: "Tech Park, Bangalore, Karnataka",
      employeeCount: "500-1000",
      foundedYear: "2015",
      submittedDate: "2024-01-21",
      status: "pending",
      documents: [
        "company-registration.pdf",
        "gst-certificate.pdf",
        "company-profile.pdf",
        "office-photos.jpg",
        "previous-internship-reports.pdf",
      ],
      description:
        "Leading software development company specializing in web and mobile applications, AI/ML solutions, and cloud services.",
      previousInternships: 25,
      rating: 4.5,
      verified: false,
    },
    {
      id: 2,
      name: "GreenEnergy Corp",
      website: "https://greenenergy.com",
      industry: "Renewable Energy",
      contactPerson: "Ms. Sneha Gupta",
      designation: "Talent Acquisition Lead",
      email: "careers@greenenergy.com",
      phone: "+91 9876543211",
      address: "Green Tower, Mumbai, Maharashtra",
      employeeCount: "200-500",
      foundedYear: "2018",
      submittedDate: "2024-01-20",
      status: "pending",
      documents: [
        "incorporation-certificate.pdf",
        "environmental-clearance.pdf",
        "company-brochure.pdf",
        "project-portfolio.pdf",
      ],
      description:
        "Renewable energy company focused on solar and wind power solutions with a commitment to sustainable development.",
      previousInternships: 12,
      rating: 4.2,
      verified: false,
    },
    {
      id: 3,
      name: "TechNova Solutions",
      website: "https://technova.com",
      industry: "Software Development",
      contactPerson: "Mr. Arjun Mehta",
      designation: "CTO",
      email: "internships@technova.com",
      phone: "+91 9876543212",
      address: "IT Hub, Pune, Maharashtra",
      employeeCount: "100-200",
      foundedYear: "2020",
      submittedDate: "2024-01-15",
      status: "verified",
      documents: ["company-registration.pdf", "tax-documents.pdf", "office-verification.pdf"],
      description:
        "Fast-growing tech startup specializing in full-stack development and digital transformation solutions.",
      previousInternships: 18,
      rating: 4.7,
      verified: true,
      verifiedDate: "2024-01-17",
      verifiedBy: "T&P Officer",
    },
    {
      id: 4,
      name: "DataFlow Analytics",
      website: "https://dataflow.com",
      industry: "Data Science",
      contactPerson: "Dr. Priya Sharma",
      designation: "Head of Research",
      email: "research@dataflow.com",
      phone: "+91 9876543213",
      address: "Research Center, Hyderabad, Telangana",
      employeeCount: "50-100",
      foundedYear: "2019",
      submittedDate: "2024-01-10",
      status: "rejected",
      documents: ["company-profile.pdf", "research-papers.pdf"],
      description: "Data analytics and AI research company providing insights and solutions for various industries.",
      previousInternships: 8,
      rating: 3.8,
      verified: false,
      rejectedDate: "2024-01-12",
      rejectedBy: "T&P Officer",
      rejectionReason: "Insufficient documentation provided. Missing company registration and tax documents.",
    },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    const matchesIndustry =
      industryFilter === "all" || company.industry.toLowerCase().includes(industryFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesIndustry
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  const handleVerify = (companyId: number) => {
    // Implementation for verifying company
    console.log("Verifying company:", companyId)
    setShowVerificationDialog(false)
  }

  const handleReject = (companyId: number) => {
    // Implementation for rejecting company
    console.log("Rejecting company:", companyId, "Reason:", rejectionReason)
    setShowRejectionDialog(false)
    setRejectionReason("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Verification</h2>
          <p className="text-gray-600">Review and verify companies for internship partnerships</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-4 py-2">
            <Building2 className="w-4 h-4 mr-2" />
            {filteredCompanies.filter((c) => c.status === "pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by company name, industry, or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-48">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="renewable">Renewable Energy</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
          <CardDescription>Click on any row to view detailed company information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Details</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedCompany(company)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {company.name}
                        {company.verified && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {company.website}
                      </div>
                      <div className="text-sm text-gray-500">{company.employeeCount} employees</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{company.industry}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{company.contactPerson}</div>
                      <div className="text-sm text-gray-500">{company.designation}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {company.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{company.documents.length} files</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {company.submittedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {company.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCompany(company)
                              setShowVerificationDialog(true)
                            }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCompany(company)
                              setShowRejectionDialog(true)
                            }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Company Details Modal */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Verification Details
            </DialogTitle>
            <DialogDescription>Complete information about the company verification request</DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company Name</label>
                    <p className="text-lg font-semibold">{selectedCompany.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-blue-600 hover:underline cursor-pointer">{selectedCompany.website}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Industry</label>
                    <p>{selectedCompany.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employee Count</label>
                    <p>{selectedCompany.employeeCount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Founded Year</label>
                    <p>{selectedCompany.foundedYear}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{selectedCompany.rating}/5</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {selectedCompany.address}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1">{selectedCompany.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-lg font-semibold">{selectedCompany.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p>{selectedCompany.designation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedCompany.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedCompany.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Verification Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCompany.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Previous Internships */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5" />
                    Internship History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCompany.previousInternships}</div>
                      <div className="text-sm text-gray-600">Previous Internships</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedCompany.rating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedCompany.foundedYear}</div>
                      <div className="text-sm text-gray-600">Established</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status and Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Current Status</label>
                        <div className="mt-1">{getStatusBadge(selectedCompany.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                        <p className="mt-1">{selectedCompany.submittedDate}</p>
                      </div>
                      {selectedCompany.status === "verified" && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Verified Date</label>
                          <p className="mt-1">{selectedCompany.verifiedDate}</p>
                        </div>
                      )}
                      {selectedCompany.status === "rejected" && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Rejected Date</label>
                          <p className="mt-1">{selectedCompany.rejectedDate}</p>
                        </div>
                      )}
                    </div>

                    {selectedCompany.status === "pending" && (
                      <div className="flex gap-3">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setShowVerificationDialog(true)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify Company
                        </Button>
                        <Button variant="destructive" onClick={() => setShowRejectionDialog(true)}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Company
                        </Button>
                      </div>
                    )}
                  </div>

                  {selectedCompany.status === "rejected" && selectedCompany.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-red-700 mt-1">{selectedCompany.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Confirmation Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Verify Company
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this company? This will make them eligible for posting internship
              opportunities.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => selectedCompany && handleVerify(selectedCompany.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Reject Company
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this company verification. This will be communicated to the company.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedCompany && handleReject(selectedCompany.id)}
                disabled={!rejectionReason.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
