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
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Eye,
  Plus,
  Edit,
  Trash2,
  Archive,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Building2,
  AlertTriangle,
} from "lucide-react"

export function InternshipOpportunities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewInternshipDialog, setShowNewInternshipDialog] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [newInternship, setNewInternship] = useState({
    company: "",
    title: "",
    description: "",
    location: "",
    type: "",
    duration: "",
    stipend: "",
    startDate: "",
    endDate: "",
    skillsRequired: "",
    eligibilityCriteria: "",
    maxApplicants: "",
  })

  const verifiedCompanies = [
    { id: 1, name: "TechNova Solutions" },
    { id: 2, name: "DataMind Analytics" },
    { id: 3, name: "AppCraft Studios" },
    { id: 4, name: "CloudScale Systems" },
  ]

  const internships = [
    {
      id: 1,
      title: "Full Stack Developer Intern",
      company: "TechNova Solutions",
      companyId: 1,
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      duration: "6 months",
      stipend: "₹35,000/month",
      startDate: "2024-02-15",
      endDate: "2024-08-15",
      postedDate: "2024-01-20",
      status: "active",
      applicants: 25,
      maxApplicants: 50,
      skillsRequired: ["React", "Node.js", "MongoDB", "TypeScript"],
      eligibilityCriteria: "3rd/4th year CS/IT students with CGPA > 7.0",
      description:
        "Join our dynamic team to build next-generation web applications using modern technologies. You'll work on real projects and gain hands-on experience in full-stack development.",
      views: 156,
    },
    {
      id: 2,
      title: "AI/ML Research Intern",
      company: "DataMind Analytics",
      companyId: 2,
      location: "Bangalore, Karnataka",
      type: "Remote",
      duration: "4 months",
      stipend: "₹40,000/month",
      startDate: "2024-02-20",
      endDate: "2024-06-20",
      postedDate: "2024-01-18",
      status: "active",
      applicants: 18,
      maxApplicants: 30,
      skillsRequired: ["Python", "TensorFlow", "Machine Learning", "Data Science"],
      eligibilityCriteria: "Final year students with background in AI/ML",
      description:
        "Work on cutting-edge AI projects and contribute to breakthrough research in machine learning and data analytics.",
      views: 234,
    },
    {
      id: 3,
      title: "Mobile App Developer",
      company: "AppCraft Studios",
      companyId: 3,
      location: "Pune, Maharashtra",
      type: "Hybrid",
      duration: "5 months",
      stipend: "₹28,000/month",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      postedDate: "2024-01-10",
      status: "closed",
      applicants: 35,
      maxApplicants: 40,
      skillsRequired: ["Flutter", "React Native", "iOS", "Android"],
      eligibilityCriteria: "3rd/4th year students with mobile development experience",
      description: "Create amazing mobile experiences for millions of users across iOS and Android platforms.",
      views: 189,
      closedDate: "2024-01-25",
      closedReason: "Maximum applicants reached",
    },
  ]

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.skillsRequired.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || internship.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Closed</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "part-time":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "remote":
        return "bg-green-100 text-green-800 border-green-200"
      case "hybrid":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCreateInternship = () => {
    // Implementation for creating new internship
    console.log("Creating internship:", newInternship)
    setShowNewInternshipDialog(false)
    setNewInternship({
      company: "",
      title: "",
      description: "",
      location: "",
      type: "",
      duration: "",
      stipend: "",
      startDate: "",
      endDate: "",
      skillsRequired: "",
      eligibilityCriteria: "",
      maxApplicants: "",
    })
  }

  const handleEditInternship = () => {
    // Implementation for editing internship
    console.log("Editing internship:", selectedInternship)
    setShowEditDialog(false)
  }

  const handleDeleteInternship = () => {
    // Implementation for deleting internship
    console.log("Deleting internship:", selectedInternship)
    setShowDeleteDialog(false)
  }

  const handleCloseInternship = (internshipId: number) => {
    // Implementation for closing internship
    console.log("Closing internship:", internshipId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Internship Opportunities</h2>
          <p className="text-gray-600">Manage and post internship opportunities for students</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewInternshipDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Internship
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Internships</p>
                <p className="text-2xl font-bold text-green-600">
                  {internships.filter((i) => i.status === "active").length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">
                  {internships.reduce((sum, i) => sum + i.applicants, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed Internships</p>
                <p className="text-2xl font-bold text-red-600">
                  {internships.filter((i) => i.status === "closed").length}
                </p>
              </div>
              <Archive className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{internships.reduce((sum, i) => sum + i.views, 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
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
                placeholder="Search by title, company, or skills..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Internships Table */}
      <Card>
        <CardHeader>
          <CardTitle>Internship Opportunities ({filteredInternships.length})</CardTitle>
          <CardDescription>Click on any row to view detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Internship Details</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type & Duration</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInternships.map((internship) => (
                <TableRow
                  key={internship.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedInternship(internship)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{internship.title}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {internship.location}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {internship.stipend}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{internship.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge className={`${getTypeColor(internship.type)} text-xs mb-1`}>{internship.type}</Badge>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {internship.duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {internship.applicants}/{internship.maxApplicants}
                      </div>
                      <div className="text-xs text-gray-500">applications</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(internship.applicants / internship.maxApplicants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(internship.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {internship.postedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {internship.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedInternship(internship)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCloseInternship(internship.id)
                            }}
                          >
                            <Archive className="w-3 h-3 mr-1" />
                            Close
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedInternship(internship)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Internship Dialog */}
      <Dialog open={showNewInternshipDialog} onOpenChange={setShowNewInternshipDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Post New Internship
            </DialogTitle>
            <DialogDescription>Create a new internship opportunity for students</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Select
                  value={newInternship.company}
                  onValueChange={(value) => setNewInternship({ ...newInternship, company: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select verified company" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifiedCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Internship Title</Label>
                <Input
                  id="title"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                  placeholder="e.g., Full Stack Developer Intern"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newInternship.description}
                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                placeholder="Describe the internship role, responsibilities, and learning opportunities..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newInternship.location}
                  onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newInternship.type}
                  onValueChange={(value) => setNewInternship({ ...newInternship, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                  placeholder="e.g., 6 months"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stipend">Stipend</Label>
                <Input
                  id="stipend"
                  value={newInternship.stipend}
                  onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                  placeholder="e.g., ₹35,000/month"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newInternship.startDate}
                  onChange={(e) => setNewInternship({ ...newInternship, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newInternship.endDate}
                  onChange={(e) => setNewInternship({ ...newInternship, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillsRequired">Skills Required</Label>
                <Input
                  id="skillsRequired"
                  value={newInternship.skillsRequired}
                  onChange={(e) => setNewInternship({ ...newInternship, skillsRequired: e.target.value })}
                  placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                />
              </div>
              <div>
                <Label htmlFor="maxApplicants">Max Applicants</Label>
                <Input
                  id="maxApplicants"
                  type="number"
                  value={newInternship.maxApplicants}
                  onChange={(e) => setNewInternship({ ...newInternship, maxApplicants: e.target.value })}
                  placeholder="e.g., 50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
              <Textarea
                id="eligibilityCriteria"
                value={newInternship.eligibilityCriteria}
                onChange={(e) => setNewInternship({ ...newInternship, eligibilityCriteria: e.target.value })}
                placeholder="e.g., 3rd/4th year CS/IT students with CGPA > 7.0"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewInternshipDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInternship} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Post Internship
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Delete Internship
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this internship? This action cannot be undone and will remove all
              associated applications.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteInternship}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Internship
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
