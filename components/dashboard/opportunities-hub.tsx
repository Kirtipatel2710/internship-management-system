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
  Zap,
  Trophy,
  Target,
  Sparkles,
} from "lucide-react"

export function OpportunitiesHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")

  const opportunities = [
    {
      id: 1,
      title: "Full Stack Developer Intern",
      company: "TechNova Solutions",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      duration: "6 months",
      stipend: "₹35,000/month",
      posted: "2 hours ago",
      deadline: "2024-02-15",
      tags: ["React", "Node.js", "MongoDB", "TypeScript"],
      description: "Join our dynamic team to build next-generation web applications using modern technologies.",
      requirements: ["Strong JavaScript fundamentals", "React experience", "Problem-solving skills"],
      isBookmarked: false,
      views: 89,
      applicants: 5,
      rating: 4.9,
      verified: true,
      featured: true,
      urgent: false,
    },
    {
      id: 2,
      title: "AI/ML Research Intern",
      company: "DataMind Analytics",
      location: "Bangalore, Karnataka",
      type: "Remote",
      duration: "4 months",
      stipend: "₹40,000/month",
      posted: "1 day ago",
      deadline: "2024-02-20",
      tags: ["Python", "TensorFlow", "Machine Learning", "Data Science"],
      description: "Work on cutting-edge AI projects and contribute to breakthrough research in machine learning.",
      requirements: ["Python proficiency", "ML fundamentals", "Research mindset"],
      isBookmarked: true,
      views: 234,
      applicants: 12,
      rating: 4.8,
      verified: true,
      featured: true,
      urgent: true,
    },
    {
      id: 3,
      title: "Mobile App Developer",
      company: "AppCraft Studios",
      location: "Pune, Maharashtra",
      type: "Hybrid",
      duration: "5 months",
      stipend: "₹28,000/month",
      posted: "3 days ago",
      deadline: "2024-02-10",
      tags: ["Flutter", "React Native", "iOS", "Android"],
      description: "Create amazing mobile experiences for millions of users across iOS and Android platforms.",
      requirements: ["Mobile development experience", "Flutter/React Native", "UI/UX understanding"],
      isBookmarked: false,
      views: 156,
      applicants: 8,
      rating: 4.6,
      verified: true,
      featured: false,
      urgent: false,
    },
    {
      id: 4,
      title: "DevOps Engineering Intern",
      company: "CloudScale Systems",
      location: "Delhi, NCR",
      type: "Full-time",
      duration: "6 months",
      stipend: "₹32,000/month",
      posted: "1 week ago",
      deadline: "2024-02-25",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      description: "Learn and implement modern DevOps practices in a cloud-native environment.",
      requirements: ["Basic cloud knowledge", "Linux familiarity", "Automation interest"],
      isBookmarked: false,
      views: 198,
      applicants: 15,
      rating: 4.7,
      verified: true,
      featured: false,
      urgent: false,
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
        return "badge-electric"
      case "part-time":
        return "badge-orange"
      case "remote":
        return "badge-green"
      case "hybrid":
        return "badge-purple"
      default:
        return "badge-electric"
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Hero Header */}
      <div className="gradient-card bg-aurora-gradient rounded-3xl p-8 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl animate-pulse-glow">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">Opportunities Hub 🌟</h1>
                  <p className="text-white/90 text-xl">
                    Discover amazing internships that match your skills and passion
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base font-bold backdrop-blur-sm">
                  <Building2 className="w-5 h-5 mr-2" />
                  {opportunities.length} Available
                </Badge>
                <Badge className="bg-electric-green/20 text-white border-electric-green/30 px-6 py-3 text-base font-bold backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {opportunities.filter((o) => o.featured).length} Featured
                </Badge>
                <Badge className="bg-vibrant-pink/20 text-white border-vibrant-pink/30 px-6 py-3 text-base font-bold backdrop-blur-sm">
                  <Zap className="w-5 h-5 mr-2" />
                  {opportunities.filter((o) => o.urgent).length} Urgent
                </Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="vibrant-card bg-white/20 backdrop-blur-sm p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">Perfect Match</div>
                <div className="text-white/80 text-lg">AI-Powered Recommendations</div>
                <Button className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                  <Target className="w-4 h-4 mr-2" />
                  Get Matched
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="vibrant-card border-0">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 icon-glow" />
              <Input
                placeholder="Search by role, company, skills, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-6 py-4 h-16 glass-morphism border-2 border-transparent focus:border-electric-blue focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg transition-all duration-300 text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge className="badge-electric">⌘F</Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 h-16 glass-morphism border-2 border-transparent focus:border-purple-500">
                  <Filter className="w-5 h-5 mr-2 icon-purple" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="glass-morphism">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-48 h-16 glass-morphism border-2 border-transparent focus:border-green-500">
                  <MapPin className="w-5 h-5 mr-2 icon-green" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="glass-morphism">
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
            className={`vibrant-card hover-glow animate-slide-up border-0 relative overflow-hidden ${
              opportunity.featured ? "ring-4 ring-electric-blue/30" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Featured Badge */}
            {opportunity.featured && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="badge-electric animate-pulse-glow">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Urgent Badge */}
            {opportunity.urgent && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="badge-pink animate-pulse-glow">
                  <Zap className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 hover:text-electric-blue transition-colors cursor-pointer">
                      {opportunity.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                    >
                      <Bookmark className={`h-5 w-5 ${opportunity.isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 font-bold text-lg">{opportunity.company}</span>
                    {opportunity.verified && (
                      <Badge className="badge-green text-xs px-3 py-1">
                        <Trophy className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 icon-orange" />
                      <span className="font-medium">{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 icon-purple" />
                      <span className="font-medium">{opportunity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 icon-green" />
                      <span className="font-medium">{opportunity.stipend}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Type and Rating */}
              <div className="flex items-center justify-between mb-6">
                <Badge className={`${getTypeColor(opportunity.type)} text-sm px-4 py-2`}>{opportunity.type}</Badge>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold text-gray-700">{opportunity.rating}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{opportunity.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{opportunity.applicants} applied</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base mb-6 leading-relaxed">{opportunity.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {opportunity.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 text-sm px-4 py-2 border border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Posted {opportunity.posted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Deadline: {opportunity.deadline}</span>
                  </div>
                </div>
                <Button className="btn-electric h-12 px-8 text-base font-bold">
                  Apply Now
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button className="btn-sunset px-12 py-4 text-lg font-bold">
          <Sparkles className="mr-3 h-5 w-5" />
          Load More Opportunities
          <ArrowRight className="ml-3 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
