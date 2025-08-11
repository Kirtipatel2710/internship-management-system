"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, MapPin, DollarSign, Users, Edit, Trash2, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface InternshipOpportunity {
  id: string
  companyName: string
  title: string
  description: string
  location: string
  mode: "onsite" | "remote" | "hybrid"
  duration: string
  stipend: string
  startDate: Date
  endDate: Date
  skillsRequired: string[]
  maxApplicants: number
  currentApplicants: number
  status: "active" | "closed" | "draft"
}

const dummyOpportunities: InternshipOpportunity[] = [
  {
    id: "opp1",
    companyName: "Tech Solutions Inc.",
    title: "Software Development Intern",
    description: "Develop and maintain web applications using React and Node.js.",
    location: "Ahmedabad, India",
    mode: "onsite",
    duration: "6 months",
    stipend: "15,000 INR/month",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-02-28"),
    skillsRequired: ["React", "Node.js", "JavaScript", "SQL"],
    maxApplicants: 10,
    currentApplicants: 5,
    status: "active",
  },
  {
    id: "opp2",
    companyName: "Global Innovations",
    title: "Data Analyst Intern",
    description: "Analyze large datasets and provide insights using Python and R.",
    location: "Remote",
    mode: "remote",
    duration: "3 months",
    stipend: "12,000 INR/month",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    skillsRequired: ["Python", "R", "Data Analysis", "Excel"],
    maxApplicants: 5,
    currentApplicants: 3,
    status: "active",
  },
  {
    id: "opp3",
    companyName: "Creative Minds Agency",
    title: "Marketing Intern",
    description: "Assist with social media campaigns and content creation.",
    location: "Mumbai, India",
    mode: "onsite",
    duration: "4 months",
    stipend: "10,000 INR/month",
    startDate: new Date("2024-08-15"),
    endDate: new Date("2024-12-15"),
    skillsRequired: ["Social Media Marketing", "Content Creation", "SEO"],
    maxApplicants: 8,
    currentApplicants: 8,
    status: "closed",
  },
  {
    id: "opp4",
    companyName: "Design Innovators",
    title: "UI/UX Design Intern",
    description: "Collaborate on user interface and experience design for mobile apps.",
    location: "Bengaluru, India",
    mode: "hybrid",
    duration: "5 months",
    stipend: "14,000 INR/month",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2025-03-31"),
    skillsRequired: ["Figma", "Adobe XD", "UI/UX Design", "Prototyping"],
    maxApplicants: 7,
    currentApplicants: 2,
    status: "draft",
  },
]

export function InternshipOpportunitiesManagement() {
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>(dummyOpportunities)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentOpportunity, setCurrentOpportunity] = useState<InternshipOpportunity | null>(null)

  // Form states
  const [companyName, setCompanyName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [mode, setMode] = useState<"onsite" | "remote" | "hybrid">("onsite")
  const [duration, setDuration] = useState("")
  const [stipend, setStipend] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [skillsInput, setSkillsInput] = useState("") // Comma-separated string
  const [maxApplicants, setMaxApplicants] = useState<number | string>("")
  const [status, setStatus] = useState<"active" | "closed" | "draft">("draft")

  const resetForm = () => {
    setCompanyName("")
    setTitle("")
    setDescription("")
    setLocation("")
    setMode("onsite")
    setDuration("")
    setStipend("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSkillsInput("")
    setMaxApplicants("")
    setStatus("draft")
    setCurrentOpportunity(null)
    setIsEditing(false)
  }

  const handleOpenDialog = (opportunity?: InternshipOpportunity) => {
    if (opportunity) {
      setIsEditing(true)
      setCurrentOpportunity(opportunity)
      setCompanyName(opportunity.companyName)
      setTitle(opportunity.title)
      setDescription(opportunity.description)
      setLocation(opportunity.location)
      setMode(opportunity.mode)
      setDuration(opportunity.duration)
      setStipend(opportunity.stipend)
      setStartDate(opportunity.startDate)
      setEndDate(opportunity.endDate)
      setSkillsInput(opportunity.skillsRequired.join(", "))
      setMaxApplicants(opportunity.maxApplicants)
      setStatus(opportunity.status)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    const applicantsNum = typeof maxApplicants === "string" ? Number.parseInt(maxApplicants, 10) : maxApplicants

    if (
      !companyName ||
      !title ||
      !description ||
      !location ||
      !duration ||
      !startDate ||
      !endDate ||
      skillsArray.length === 0 ||
      isNaN(applicantsNum)
    ) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields correctly.",
      })
      return
    }

    if (isEditing && currentOpportunity) {
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === currentOpportunity.id
            ? {
                ...opp,
                companyName,
                title,
                description,
                location,
                mode,
                duration,
                stipend,
                startDate: startDate!,
                endDate: endDate!,
                skillsRequired: skillsArray,
                maxApplicants: applicantsNum,
                status,
              }
            : opp,
        ),
      )
      toast.success("Opportunity Updated", {
        description: `${title} has been updated successfully.`,
      })
    } else {
      const newOpportunity: InternshipOpportunity = {
        id: `opp${opportunities.length + 1}`, // Simple ID generation
        companyName,
        title,
        description,
        location,
        mode,
        duration,
        stipend,
        startDate: startDate!,
        endDate: endDate!,
        skillsRequired: skillsArray,
        maxApplicants: applicantsNum,
        currentApplicants: 0, // New opportunities start with 0 applicants
        status,
      }
      setOpportunities((prev) => [...prev, newOpportunity])
      toast.success("Opportunity Created", {
        description: `${title} has been added successfully.`,
      })
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== id))
    toast.info("Opportunity Deleted", {
      description: "The internship opportunity has been removed.",
    })
  }

  const getStatusBadge = (status: InternshipOpportunity["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Active
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Closed
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Draft
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Internship Opportunities Management</CardTitle>
          <CardDescription>Create, edit, and manage internship opportunities.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Internship Opportunity" : "Add New Internship Opportunity"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the details of the internship opportunity."
                  : "Fill in the details for a new internship opportunity."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., TechCorp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Internship Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Software Engineer Intern"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the role and responsibilities."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Remote, New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select
                    value={mode}
                    onValueChange={(value: "onsite" | "remote" | "hybrid") => setMode(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 3 months, 6 weeks"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stipend">Stipend (Optional)</Label>
                  <Input
                    id="stipend"
                    placeholder="e.g., 15,000 INR/month"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills Required (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., React, Node.js, SQL"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maxApplicants">Max Applicants</Label>
                  <Input
                    id="maxApplicants"
                    type="number"
                    placeholder="e.g., 10"
                    value={maxApplicants}
                    onChange={(e) => setMaxApplicants(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: "active" | "closed" | "draft") => setStatus(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Save Changes" : "Create Opportunity"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No internship opportunities available. Click "Add New Opportunity" to get started.
          </p>
        ) : (
          <div className="grid gap-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <h3 className="text-lg font-semibold text-primary">{opportunity.title}</h3>
                  {getStatusBadge(opportunity.status)}
                </div>
                <p className="text-muted-foreground text-sm mb-2">{opportunity.companyName}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {opportunity.location} ({opportunity.mode})
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> {opportunity.stipend}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" /> {opportunity.duration} (
                    {format(opportunity.startDate, "MMM dd")} - {format(opportunity.endDate, "MMM dd, yyyy")})
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {opportunity.currentApplicants}/{opportunity.maxApplicants} Applicants
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{opportunity.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {opportunity.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(opportunity)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(opportunity.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
