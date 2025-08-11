"use client"

import { CardDescription } from "@/components/ui/card"

import { Calendar } from "@/components/ui/calendar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Briefcase, FileText, CheckCircle, Clock } from "lucide-react"

const dummyData = {
  totalApplications: 15,
  approvedApplications: 8,
  pendingApplications: 5,
  rejectedApplications: 2,
  nocRequests: 7,
  approvedNoc: 4,
  pendingNoc: 2,
  rejectedNoc: 1,
}

const applicationStatusData = [
  { name: "Approved", count: dummyData.approvedApplications },
  { name: "Pending", count: dummyData.pendingApplications },
  { name: "Rejected", count: dummyData.rejectedApplications },
]

export function Overview() {
  const applicationProgress = (dummyData.approvedApplications / dummyData.totalApplications) * 100 || 0
  const nocProgress = (dummyData.approvedNoc / dummyData.nocRequests) * 100 || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dummyData.totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            {dummyData.approvedApplications} Approved, {dummyData.pendingApplications} Pending
          </p>
          <Progress value={applicationProgress} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">NOC Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dummyData.nocRequests}</div>
          <p className="text-xs text-muted-foreground">
            {dummyData.approvedNoc} Approved, {dummyData.pendingNoc} Pending
          </p>
          <Progress value={nocProgress} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">5 Approved, 3 Pending</p>
          <Progress value={62.5} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificates</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">2 Approved, 1 Pending</p>
          <Progress value={66.6} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Application Status Breakdown</CardTitle>
          <CardDescription>Overview of your internship application statuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationStatusData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-blue-500" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest interactions and updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">NOC Request Approved</p>
                <p className="text-xs text-muted-foreground">Your NOC for Tech Solutions Inc. has been approved.</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Weekly Report Submitted</p>
                <p className="text-xs text-muted-foreground">Week 5 report submitted for review.</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">New Opportunity Posted</p>
                <p className="text-xs text-muted-foreground">
                  Check out the new Software Engineer role at Innovate Corp.
                </p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">30 minutes ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
