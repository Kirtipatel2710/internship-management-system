"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase, type InternshipOpportunity } from "@/lib/supabase"
import { Search, MapPin, Clock, DollarSign, Users, Building2, Send } from "lucide-react"
import { toast } from "@/components/ui/sonner"

export function InternshipOpportunities() {
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<InternshipOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [selectedOpportunity, setSelectedOpportunity] = useState<InternshipOpportunity | null>(null)
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    resumeUrl: "",
  })
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    filterOpportunities()
  }, [opportunities, searchTerm, locationFilter, modeFilter])

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("internship_opportunities")
        .select(`
          *,
          companies (
            name,
            industry,
            description
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) throw error

      setOpportunities(data || [])
    } catch (error) {
      console.error("Error fetching opportunities:", error)
      toast.error("Failed to load opportunities")
    } finally {
      setLoading(false)
    }
  }

  const filterOpportunities = () => {
    let filtered = opportunities

    if (searchTerm) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.companies?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((opp) => opp.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (modeFilter !== "all") {
      filtered = filtered.filter((opp) => opp.mode === modeFilter)
    }

    setFilteredOpportunities(filtered)
  }

  const handleApply = async () => {
    if (!selectedOpportunity) return

    setApplying(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to apply")
        return
      }

      const { error } = await supabase.from("internship_applications").insert({
        student_id: user.id,
        opportunity_id: selectedOpportunity.id,
        cover_letter: applicationData.coverLetter,
        resume_url: applicationData.resumeUrl,
        status: "pending_teacher",
      })

      if (error) throw error

      toast.success("Application submitted successfully!")
      setSelectedOpportunity(null)
      setApplicationData({ coverLetter: "", resumeUrl: "" })
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "remote":
        return "bg-green-100 text-green-800"
      case "hybrid":
        return "bg-blue-100 text-blue-800"
      case "onsite":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Internship Opportunities</h1>
        <p className="text-gray-600">Discover and apply for internship positions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Work Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 flex items-center">
              {filteredOpportunities.length} opportunities found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {opportunity.companies?.name}
                  </CardDescription>
                </div>
                <Badge className={getModeColor(opportunity.mode)}>{opportunity.mode}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{opportunity.description}</p>

              <div className="space-y-2">
                {opportunity.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {opportunity.location}
                  </div>
                )}
                {opportunity.duration && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {opportunity.duration}
                  </div>
                )}
                {opportunity.stipend && (
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {opportunity.stipend}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {opportunity.current_applicants}/{opportunity.max_applicants} applied
                </div>
              </div>

              {opportunity.skills_required && opportunity.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {opportunity.skills_required.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {opportunity.skills_required.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{opportunity.skills_required.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedOpportunity(opportunity)}
                    disabled={opportunity.current_applicants >= opportunity.max_applicants}
                  >
                    {opportunity.current_applicants >= opportunity.max_applicants ? "Applications Closed" : "Apply Now"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply for {selectedOpportunity?.title}</DialogTitle>
                    <DialogDescription>Submit your application for this internship position</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Write a compelling cover letter explaining why you're interested in this position..."
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
                      <Input
                        id="resumeUrl"
                        placeholder="https://drive.google.com/your-resume"
                        value={applicationData.resumeUrl}
                        onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedOpportunity(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApply} disabled={applying || !applicationData.coverLetter}>
                        {applying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOpportunities.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
