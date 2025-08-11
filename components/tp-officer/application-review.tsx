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
  Download,
  User,
  Briefcase,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  FileText,
  Star,
  Clock,
} from "lucide-react"

export function ApplicationReview() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [internshipFilter, setInternshipFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const applications = [
    {
      id: 1,
      studentName: "Rahul Sharma",
      enrollmentNo: "CS2021001",
      branch: "Computer Science",
      year: "3rd Year",
      cgpa: "8.5",
      email: "rahul.sharma@college.edu",
      phone: "+91 9876543210",
      internshipTitle: "Full Stack Developer Intern",
      company: "TechNova Solutions",
      appliedDate: "2024-01-22",
      status: "pending",
      resumeUrl: "resume-rahul-sharma.pdf",
      coverLetter:
        "I am excited to apply for the Full Stack Developer internship at TechNova Solutions. With my strong foundation in React, Node.js, and database management, I believe I can contribute effectively to your team while gaining valuable industry experience.",
      skills: ["React", "Node.js", "JavaScript", "MongoDB", "Git"],
      projects: [
        { name: "E-commerce Website", tech: "React, Node.js, MongoDB" },
        { name: "Task Management App", tech: "React, Express, MySQL" },
      ],
      experience: "6 months freelance web development",
      github: "https://github.com/rahulsharma",
      linkedin: "https://linkedin.com/in/rahulsharma",
    },
    {
      id: 2,
      studentName: "Priya Patel",
      enrollmentNo: "IT2021045",
      branch: "Information Technology",
      year: "4th Year",
      cgpa: "9.2",
      email: "priya.patel@college.edu",
      phone: "+91 9876543211",
      internshipTitle: "AI/ML Research Intern",
      company: "DataMind Analytics",
      appliedDate: "2024-01-21",
      status: "pending",
      resumeUrl: "resume-priya-patel.pdf",
      coverLetter:
        "As a final year IT student with a passion for artificial intelligence and machine learning, I am thrilled to apply for the AI/ML Research Intern position. My academic projects and research experience in deep learning make me a strong candidate for this role.",
      skills: ["Python", "TensorFlow", "Scikit-learn", "Pandas", "NumPy"],
      projects: [
        { name: "Image Classification System", tech: "Python, TensorFlow, CNN" },
        { name: "Sentiment Analysis Tool", tech: "Python, NLTK, ML" },
      ],
      experience: "Research assistant for 1 year",
      github: "https://github.com/priyapatel",
      linkedin: "https://linkedin.com/in/priyapatel",
    },
    {
      id: 3,
      studentName: "Amit Kumar",
      enrollmentNo: "CS2021023",
      branch: "Computer Science",
      year: "3rd Year",
      cgpa: "7.8",
      email: "amit.kumar@college.edu",
      phone: "+91 9876543212",
      internshipTitle: "Full Stack Developer Intern",
      company: "TechNova Solutions",
      appliedDate: "2024-01-20",
      status: "approved",
      resumeUrl: "resume-amit-kumar.pdf",
      coverLetter:
        "I am writing to express my interest in the Full Stack Developer internship. My experience with modern web technologies and passion for creating user-friendly applications align perfectly with this opportunity.",
      skills: ["React", "Vue.js", "Node.js", "PostgreSQL", "Docker"],
      projects: [
        { name: "Social Media Dashboard", tech: "Vue.js, Node.js, PostgreSQL" },
        { name: "Real-time Chat App", tech: "React, Socket.io, Express" },
      ],
      experience: "2 internships completed",
      github: "https://github.com/amitkumar",
      linkedin: "https://linkedin.com/in/amitkumar",
      approvedDate: "2024-01-23",
      approvedBy: "T&P Officer",
    },
    {
      id: 4,
      studentName: "Sneha Gupta",
      enrollmentNo: "IT2021067",
      branch: "Information Technology",
      year: "3rd Year",
      cgpa: "6.9",
      email: "sneha.gupta@college.edu",
      phone: "+91 9876543213",
      internshipTitle: "AI/ML Research Intern",
      company: "DataMind Analytics",
      appliedDate: "2024-01-19",
      status: "rejected",
      resumeUrl: "resume-sneha-gupta.pdf",
      coverLetter:
        "I am interested in applying for the AI/ML Research Intern position. Although I am still learning, I am eager to contribute and learn from your experienced team.",
      skills: ["Python", "Basic ML", "Data Analysis"],
      projects: [{ name: "Basic Data Visualization", tech: "Python, Matplotlib" }],
      experience: "No prior experience",
      github: "https://github.com/snehagupta",
      linkedin: "https://linkedin.com/in/snehagupta",
      rejectedDate: "2024-01-24",
      rejectedBy: "T&P Officer",
      rejectionReason:
        "CGPA below minimum requirement (7.0) and insufficient technical experience for the research role.",
    },
  ]

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    const matchesInternship =
      internshipFilter === "all" || application.internshipTitle.toLowerCase().includes(internshipFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesInternship
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  const getCGPAColor = (cgpa: string) => {
    const score = Number.parseFloat(cgpa)
    if (score >= 9.0) return "text-green-600 font-bold"
    if (score >= 8.0) return "text-blue-600 font-bold"
    if (score >= 7.0) return "text-orange-600 font-bold"
    return "text-red-600 font-bold"
  }

  const handleApprove = (applicationId: number) => {
    // Implementation for approving application
    console.log("Approving application:", applicationId)
    setShowApprovalDialog(false)
  }

  const handleReject = (applicationId: number) => {
    // Implementation for rejecting application
    console.log("Rejecting application:", applicationId, "Reason:", rejectionReason)
    setShowRejectionDialog(false)
    setRejectionReason("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
          <p className="text-gray-600">Review student applications for internship opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {filteredApplications.filter((a) => a.status === "pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {applications.filter((a) => a.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter((a) => a.status === "approved").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter((a) => a.status === "rejected").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name, enrollment number, or internship..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={internshipFilter} onValueChange={setInternshipFilter}>
              <SelectTrigger className="w-48">
                <Briefcase className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by internship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Internships</SelectItem>
                <SelectItem value="full stack">Full Stack Developer</SelectItem>
                <SelectItem value="ai ml">AI/ML Research</SelectItem>
                <SelectItem value="mobile">Mobile Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Click on any row to view detailed application information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Academic Info</TableHead>
                <TableHead>Internship</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow
                  key={application.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedApplication(application)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.studentName}</div>
                      <div className="text-sm text-gray-500">{application.enrollmentNo}</div>
                      <div className="text-sm text-gray-500">{application.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{application.branch}</div>
                      <div className="text-sm text-gray-500">{application.year}</div>
                      <div className={`text-sm ${getCGPAColor(application.cgpa)}`}>CGPA: {application.cgpa}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{application.internshipTitle}</div>
                      <div className="text-sm text-gray-500">{application.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {application.appliedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {application.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApplication(application)
                              setShowApprovalDialog(true)
                            }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApplication(application)
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

      {/* Application Details Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Application Details
            </DialogTitle>
            <DialogDescription>Complete information about the student application</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-semibold">{selectedApplication.studentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Enrollment Number</label>
                    <p className="text-lg font-semibold">{selectedApplication.enrollmentNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Branch</label>
                    <p>{selectedApplication.branch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Year</label>
                    <p>{selectedApplication.year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CGPA</label>
                    <p className={getCGPAColor(selectedApplication.cgpa)}>{selectedApplication.cgpa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedApplication.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p>{selectedApplication.experience}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Internship Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-5 w-5" />
                    Internship Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-lg font-semibold">{selectedApplication.internshipTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-lg font-semibold">{selectedApplication.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applied Date</label>
                    <p>{selectedApplication.appliedDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                    <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{selectedApplication.coverLetter}</p>
                </CardContent>
              </Card>

              {/* Skills and Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="h-5 w-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.skills.map((skill: string, index: number) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="h-5 w-5" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedApplication.projects.map((project: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.tech}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resume and Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Documents & Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Resume</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">GitHub</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
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
                        <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Applied Date</label>
                        <p className="mt-1">{selectedApplication.appliedDate}</p>
                      </div>
                      {selectedApplication.status === "approved" && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved Date</label>
                          <p className="mt-1">{selectedApplication.approvedDate}</p>
                        </div>
                      )}
                      {selectedApplication.status === "rejected" && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Rejected Date</label>
                          <p className="mt-1">{selectedApplication.rejectedDate}</p>
                        </div>
                      )}
                    </div>

                    {selectedApplication.status === "pending" && (
                      <div className="flex gap-3">
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowApprovalDialog(true)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Application
                        </Button>
                        <Button variant="destructive" onClick={() => setShowRejectionDialog(true)}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Application
                        </Button>
                      </div>
                    )}
                  </div>

                  {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-red-700 mt-1">{selectedApplication.rejectionReason}</p>
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

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Approve Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this application? The student will be notified of the approval.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => selectedApplication && handleApprove(selectedApplication.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Application
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
              Reject Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will be communicated to the student.
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
                onClick={() => selectedApplication && handleReject(selectedApplication.id)}
                disabled={!rejectionReason.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
