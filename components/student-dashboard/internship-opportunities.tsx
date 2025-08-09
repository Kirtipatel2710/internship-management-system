"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import { Building2, MapPin, DollarSign, Calendar, Search, Filter } from "lucide-react"
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

export function InternshipOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    const filtered = opportunities.filter(
      (opp) =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOpportunities(filtered)
  }, [opportunities, searchTerm])

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Internship Opportunities</h2>
          <p className="text-muted-foreground">Browse available internship positions</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Check back later for new opportunities"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{opportunity.company_name}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.application_deadline && (
                      <Badge variant={isDeadlinePassed(opportunity.application_deadline) ? "destructive" : "secondary"}>
                        <Calendar className="h-3 w-3 mr-1" />
                        Deadline: {formatDate(opportunity.application_deadline)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">{opportunity.description}</CardDescription>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {opportunity.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{opportunity.location}</span>
                    </div>
                  )}
                  {opportunity.stipend && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{opportunity.stipend}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {formatDate(opportunity.created_at)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    className="flex-1"
                    disabled={isDeadlinePassed(opportunity.application_deadline)}
                    onClick={() => {
                      toast({
                        title: "Application Started",
                        description: "Redirecting to NOC request form...",
                      })
                      // Here you would typically navigate to the NOC request form
                      // with pre-filled company information
                    }}
                  >
                    {isDeadlinePassed(opportunity.application_deadline) ? "Deadline Passed" : "Apply Now"}
                  </Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
