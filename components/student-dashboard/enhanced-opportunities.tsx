"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { Building2, MapPin, DollarSign, Calendar, Search, Users, Clock, ExternalLink, Briefcase } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Opportunity {
  id: string
  title: string
  description: string
  company_name: string
  location: string | null
  stipend: string | null
  application_deadline: string | null
  created_at: string
}

export function EnhancedOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [durationFilter, setDurationFilter] = useState("all")
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    let filtered = opportunities.filter(
      (opp) =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (locationFilter !== "all") {
      filtered = filtered.filter((opp) => opp.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    setFilteredOpportunities(filtered)
  }, [opportunities, searchTerm, locationFilter, durationFilter])

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setOpportunities(data || [])
    } catch (error) {
      console.error("Error fetching opportunities:", error)
      toast({
        title: "Error",
        description: "Failed to fetch internship opportunities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isDeadlinePassed = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return null
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { text: "Expired", variant: "destructive" as const }
    if (diffDays <= 3) return { text: `${diffDays} days left`, variant: "destructive" as const }
    if (diffDays <= 7) return { text: `${diffDays} days left`, variant: "secondary" as const }
    return { text: `${diffDays} days left`, variant: "default" as const }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Internship Opportunities</h2>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Internship Opportunities</h2>
            <p className="text-gray-600">Discover and apply for verified internship positions</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 px-3 py-1">{filteredOpportunities.length} New</Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="pune">Pune</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
            </SelectContent>
          </Select>
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Durations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Check back later for new opportunities"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOpportunities.map((opportunity) => {
            const deadlineStatus = getDeadlineStatus(opportunity.application_deadline)

            return (
              <Card
                key={opportunity.id}
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
              >
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                          <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{opportunity.title}</CardTitle>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{opportunity.company_name}</span>
                            <Badge variant="outline" className="ml-2">
                              internship
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {deadlineStatus && (
                        <Badge variant={deadlineStatus.variant} className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {deadlineStatus.text}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed text-gray-700">
                    {opportunity.description}
                  </CardDescription>

                  {/* Skills/Technologies */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React.js</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    {opportunity.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{opportunity.location}</span>
                      </div>
                    )}
                    {opportunity.stipend && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{opportunity.stipend}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">6 months</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">5 positions</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <span>Stipend: 15000</span>
                      <span>Positions: 5</span>
                      <span>Applications: 23</span>
                    </div>
                    {opportunity.application_deadline && (
                      <span>Deadline: {formatDate(opportunity.application_deadline)}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      className="flex-1"
                      disabled={isDeadlinePassed(opportunity.application_deadline)}
                      onClick={() => {
                        toast({
                          title: "Application Started",
                          description: "Redirecting to NOC request form...",
                        })
                      }}
                    >
                      {isDeadlinePassed(opportunity.application_deadline) ? "Deadline Passed" : "Apply Now"}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="sm:w-auto bg-transparent">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
