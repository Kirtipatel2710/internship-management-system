"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, CheckCircle, Clock, MessageSquare, FileText } from "lucide-react"

export default function TeacherDashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Supervised</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 new this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Reports awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Internships</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Student feedback score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Students Under Supervision</CardTitle>
            <CardDescription>Monitor your students' internship progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Rahul Patel</p>
                <p className="text-sm text-gray-500">Software Development @ TechCorp</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Priya Shah</p>
                <p className="text-sm text-gray-500">Data Analysis @ DataFlow Inc</p>
              </div>
              <Badge variant="outline">Report Due</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Arjun Mehta</p>
                <p className="text-sm text-gray-500">UI/UX Design @ Creative Studios</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your supervision duties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Review Pending Reports
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Students
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Schedule Meetings
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Grade Internships
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
