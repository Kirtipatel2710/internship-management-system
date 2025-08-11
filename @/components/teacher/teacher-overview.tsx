"use client"

import { CardDescription } from "@/components/ui/card"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Users, FileText, CheckCircle, Clock } from "lucide-react"

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 50) + 10,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 50) + 10,
  },
]

export function TeacherOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">150</div>
          <p className="text-xs text-muted-foreground">+10 new this semester</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending NOC Approvals</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">Needs your attention</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Application Reviews</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">New applications</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Internships</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">75</div>
          <p className="text-xs text-muted-foreground">+5 this month</p>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Student Activity</CardTitle>
          <CardDescription>Number of student interactions (NOCs, applications, reports) over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-blue-500" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent NOC Requests</CardTitle>
          <CardDescription>Latest NOC requests from your students.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">NOC from Alice Smith</p>
                <p className="text-xs text-muted-foreground">For Software Engineer Intern at Tech Solutions Inc.</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">NOC from Bob Johnson</p>
                <p className="text-xs text-muted-foreground">Approved for Data Analyst at Global Innovations</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">NOC from Charlie Brown</p>
                <p className="text-xs text-muted-foreground">For Marketing Intern at Creative Minds Agency</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Weekly Reports</CardTitle>
          <CardDescription>Latest weekly reports submitted by your students.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Week 5 Report from Alice Smith</p>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Week 4 Report from Bob Johnson</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Week 3 Report from Charlie Brown</p>
                <p className="text-xs text-muted-foreground">Needs revision</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
