"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Calendar, Users, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import { toast } from "@/components/ui/sonner"

interface Opportunity {
  id: string
  title: string
  company: string
  location: string
  type: string // e.g., Full-time, Internship
  stipend: string
  duration: string
  applicants: number
  description: string
  skills: string[]
  applicationLink?: string // Optional direct application link
}

const dummyOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Software Development Intern",
    company: "Tech Solutions Inc.",
    location: "Ahmedabad, India",
    type: "Internship",
    stipend: "₹15,000/month",
    duration: "6 Months",
    applicants: 25,
    description:
      "Join our dynamic team to work on cutting-edge web applications using React and Node.js. Gain hands-on experience in a fast-paced environment.",
    skills: ["React", "Node.js", "JavaScript", "MongoDB"],
    applicationLink: "https://techsolutions.com/careers/software-intern",
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "Global Insights Co.",
    location: "Remote",
    type: "Internship",
    stipend: "₹12,000/month",
    duration: "3 Months",
    applicants: 18,
    description:
      "Help us analyze large datasets to derive actionable insights. Proficiency in Python and SQL is a plus. Work remotely with a flexible schedule.",
    skills: ["Python", "SQL", "Data Analysis", "Excel"],
  },
  {
    id: "3",
    title: "Marketing Intern",
    company: "Creative Minds Agency",
    location: "Mumbai, India",
    type: "Internship",
    stipend: "₹10,000/month",
    duration: "4 Months",
    applicants: 30,
    description:
      "Assist our marketing team with social media campaigns, content creation, and market research. Learn about digital marketing strategies.",
    skills: ["Marketing", "Social Media", "Content Creation", "SEO"],
    applicationLink: "https://creativeminds.agency/apply/marketing",
  },
  {
    id: "4",
    title: "UI/UX Design Intern",
    company: "Design Innovators",
    location: "Bengaluru, India",
    type: "Internship",
    stipend: "₹14,000/month",
    duration: "5 Months",
    applicants: 12,
    description:
      "Collaborate with our design team to create intuitive and visually appealing user interfaces. Experience with Figma or Adobe XD is preferred.",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Wireframing"],
  },
  {
    id: "5",
    title: "Financial Analyst Intern",
    company: "Capital Growth Group",
    location: "Delhi, India",
    type: "Internship",
    stipend: "₹18,000/month",
    duration: "6 Months",
    applicants: 8,
    description:
      "Gain exposure to financial modeling, market research, and investment analysis. Strong analytical skills and attention to detail are essential.",
    skills: ["Finance", "Accounting", "Financial Modeling", "Excel"],
  },
]

export function EnhancedOpportunities() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(dummyOpportunities)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFiles, setResumeFiles] = useState<string[]>([])
  const [additionalDocs, setAdditionalDocs] = useState<string[]>([])

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const lowerCaseLocationFilter = locationFilter.toLowerCase()

    const filtered = dummyOpportunities.filter((opportunity) => {
      const matchesSearchTerm =
        opportunity.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        opportunity.company.toLowerCase().includes(lowerCaseSearchTerm) ||
        opportunity.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        opportunity.skills.some((skill) => skill.toLowerCase().includes(lowerCaseSearchTerm))

      const matchesLocation = opportunity.location.toLowerCase().includes(lowerCaseLocationFilter)

      return matchesSearchTerm && matchesLocation
    })
    setFilteredOpportunities(filtered)
  }

  const handleApplyClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDialogOpen(true)
    setCoverLetter("")
    setResumeFiles([])
    setAdditionalDocs([])
  }

  const handleSubmitApplication = () => {
    if (!resumeFiles.length) {
      toast.error("Resume Required", {
        description: "Please upload your resume to apply.",
      })
      return
    }

    // Simulate application submission
    console.log("Submitting application for:", selectedOpportunity?.title, {
      coverLetter,
      resumeFiles,
      additionalDocs,
    })
    toast.success("Application Submitted", {
      description: `Your application for ${selectedOpportunity?.title} has been submitted successfully!`,
    })
    setIsDialogOpen(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Internship Opportunities Hub</CardTitle>
        <CardDescription>Explore and apply for the latest internship opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or skills..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by location (e.g., Remote, Ahmedabad)..."
              className="pl-9"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className="grid gap-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <h3 className="text-lg font-semibold text-primary">{opportunity.title}</h3>
                  <Badge variant="secondary" className="mt-2 md:mt-0">
                    {opportunity.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{opportunity.company}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {opportunity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> {opportunity.stipend}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {opportunity.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {opportunity.applicants} Applicants
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{opportunity.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {opportunity.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleApplyClick(opportunity)} className="w-full md:w-auto">
                    Apply Now
                  </Button>
                  {opportunity.applicationLink && (
                    <Button variant="outline" asChild className="w-full md:w-auto bg-transparent">
                      <a href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer">
                        External Link <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No opportunities found matching your criteria.</p>
          )}
        </div>
      </CardContent>

      {selectedOpportunity && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for {selectedOpportunity.title}</DialogTitle>
              <DialogDescription>
                Complete the form below to submit your application to {selectedOpportunity.company}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Write a brief cover letter..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="grid gap-2">
                <Label>Upload Resume (Required)</Label>
                <EnhancedFileUpload
                  onFileUpload={setResumeFiles}
                  maxFiles={1}
                  maxSizeMb={5}
                  acceptedFileTypes={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ]}
                />
              </div>
              <div className="grid gap-2">
                <Label>Additional Documents (Optional)</Label>
                <EnhancedFileUpload
                  onFileUpload={setAdditionalDocs}
                  maxFiles={3}
                  maxSizeMb={5}
                  acceptedFileTypes={["application/pdf", "image/*"]}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication}>Submit Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
