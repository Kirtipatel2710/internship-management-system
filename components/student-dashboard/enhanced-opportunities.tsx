"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  Briefcase,
  Calendar,
  DollarSign,
  ArrowRight,
  Bookmark,
  Eye,
} from "lucide-react"

export function EnhancedOpportunities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")

  const opportunities = [
    {
      id: 1,
      title: "Software Development Intern",
      company: "Tech Solutions Inc.",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      duration: "6 months",
      stipend: "₹25,000/month",
      posted: "2 days ago",
      deadline: "2024-01-30",
      tags: ["React", "Node.js", "JavaScript"],
      description: "Looking for passionate software development interns to work on cutting-edge web applications.",
      requirements: ["Strong foundation in JavaScript", "Experience with React", "Good problem-solving skills"],
      isBookmarked: false,
      views: 245,
      applicants: 12,
      rating: 4.8,
      verified: true,
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Analytics Pro Ltd.",
      location: "Bangalore, Karnataka",
      type: "Remote",
      duration: "4 months",
      stipend: "₹30,000/month",
      posted: "1 week ago",
      deadline: "2024-02-05",
      tags: ["Python", "Machine Learning", "SQL"],
      description: "Join our data science team to work on exciting ML projects and gain hands-on experience.",
      requirements: ["Python programming", "Statistics knowledge", "SQL skills"],
      isBookmarked: true,
      views: 189,
      applicants: 8,
      rating: 4.6,
      verified: true,
    },
    {
      id: 3,
      title: "UI/UX Design Intern",
      company: "Creative Studio",
      location: "Pune, Maharashtra",
      type: "Part-time",
      duration: "3 months",
      stipend: "₹18,000/month",
      posted: "3 days ago",
      deadline: "2024-01-25",
      tags: ["Figma", "Adobe XD", "Prototyping"],
      description: "Create stunning user interfaces and experiences for our diverse range of clients.",
      requirements: ["Design portfolio", "Figma/Adobe XD skills", "Creative thinking"],
      isBookmarked: false,
      views: 156,
      applicants: 15,
      rating: 4.4,
      verified: false,
    },
    {
      id: 4,
      title: "Digital Marketing Intern",
      company: "Marketing Hub",
      location: "Delhi, NCR",
      type: "Hybrid",
      duration: "5 months",
      stipend: "₹22,000/month",
      posted: "5 days ago",
      deadline: "2024-02-10",
      tags: ["SEO", "Social Media", "Content Marketing"],
      description: "Help build and execute digital marketing campaigns for various brands and products.",
      requirements: ["Basic marketing knowledge", "Social media savvy", "Content creation skills"],
      isBookmarked: false,
      views: 298,
      applicants: 23,
      rating: 4.5,
      verified: true,
    },
  ]

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = filterType === "all" || opp.type.toLowerCase().includes(filterType.toLowerCase())
    const matchesLocation =
      filterLocation === "all" || opp.location.toLowerCase().includes(filterLocation.toLowerCase())

    return matchesSearch && matchesType && matchesLocation
  })

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "badge-info"
      case "part-time":
        return "badge-warning"
      case "remote":
        return "badge-success"
      case "hybrid":
        return "badge-error"
      default:
        return "badge-info"
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Internship Opportunities</h1>
                <p className="text-gray-600 text-lg">Discover amazing opportunities to kickstart your career</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:items-end space-y-2">
            <Badge className="badge-success px-4 py-2 text-sm font-medium">
              <Building2 className="w-4 h-4 mr-2" />
              {opportunities.length} Available
            </Badge>
            <Badge className="badge-info px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />5 New This Week
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="modern-card">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 glass-card border-gray-200/50 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 h-12 glass-card border-gray-200/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-40 h-12 glass-card border-gray-200/50">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredOpportunities.map((opportunity, index) => (
          <Card
            key={opportunity.id}
            className="modern-card hover-glow animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                      {opportunity.title}
                    </h3>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 transition-colors">
                      <Bookmark className={`h-4 w-4 ${opportunity.isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">{opportunity.company}</span>
                    {opportunity.verified && <Badge className="badge-success text-xs px-2 py-0.5">Verified</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {opportunity.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {opportunity.stipend}
                    </div>
                  </div>
                </div>
              </div>

              {/* Type and Rating */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={getTypeColor(opportunity.type)}>{opportunity.type}</Badge>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{opportunity.rating}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {opportunity.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {opportunity.applicants} applied
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Posted {opportunity.posted}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Deadline: {opportunity.deadline}
                  </div>
                </div>
                <Button className="btn-modern h-9 px-4 text-sm">
                  Apply Now
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button className="btn-outline-modern px-8 py-3">
          Load More Opportunities
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
