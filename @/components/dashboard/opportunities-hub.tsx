"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Calendar, Users } from "lucide-react"

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

export function OpportunitiesHub() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(dummyOpportunities)

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
                <Button className="w-full md:w-auto">Apply Now</Button>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No opportunities found matching your criteria.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
