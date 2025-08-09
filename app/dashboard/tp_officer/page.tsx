"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, TrendingUp, Calendar, Plus, FileText, Phone, Mail } from "lucide-react"

export default function TPOfficerDashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 new partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Company Partnerships</CardTitle>
            <CardDescription>Manage company relationships and internship opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">TechCorp Solutions</p>
                  <p className="text-sm text-gray-500">15 internship positions</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">DataFlow Inc</p>
                  <p className="text-sm text-gray-500">8 internship positions</p>
                </div>
              </div>
              <Badge variant="outline">New Partnership</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium">Creative Studios</p>
                  <p className="text-sm text-gray-500">5 internship positions</p>
                </div>
              </div>
              <Badge variant="secondary">Pending Review</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Management Tools</CardTitle>
            <CardDescription>Streamline your T&P operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Company
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Campus Drives
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Bulk Notifications
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Contact Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
