"use client"

import { CardDescription } from "@/components/ui/card"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Briefcase, FileText, Users, CheckCircle, Clock, XCircle } from "lucide-react"

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function TpOfficerOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">350</div>
          <p className="text-xs text-muted-foreground">+20 new this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120</div>
          <p className="text-xs text-muted-foreground">+10 posted this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending NOCs</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45</div>
          <p className="text-xs text-muted-foreground">Needs review</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">800</div>
          <p className="text-xs text-muted-foreground">+50 this month</p>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Activity Overview</CardTitle>
          <CardDescription>Total applications and NOC requests over time.</CardDescription>
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
          <CardTitle>Recent Company Verifications</CardTitle>
          <CardDescription>Latest companies reviewed by T&P officers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">InnovateX Solutions</p>
                <p className="text-xs text-muted-foreground">Verified by John Doe</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Global Tech Corp</p>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">3 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Startup XYZ</p>
                <p className="text-xs text-muted-foreground">Rejected due to incomplete documents</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Internship Postings</CardTitle>
          <CardDescription>Newly added internship opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Software Engineer Intern at ABC Corp</p>
                <p className="text-xs text-muted-foreground">Posted by Jane Smith</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Marketing Intern at Digital Agency</p>
                <p className="text-xs text-muted-foreground">Posted by John Doe</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Data Science Intern at Analytics Hub</p>
                <p className="text-xs text-muted-foreground">Posted by Sarah Lee</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
