"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Database, Activity, Settings, UserPlus, BarChart3, Lock } from "lucide-react"

export default function SuperAdminDashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
            <p className="text-xs text-muted-foreground">+150MB this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All systems secure</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Students</p>
                <p className="text-sm text-gray-500">1,156 active users</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Teachers</p>
                <p className="text-sm text-gray-500">78 active users</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">T&P Officers</p>
                <p className="text-sm text-gray-500">12 active users</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Administrators</p>
                <p className="text-sm text-gray-500">1 active user</p>
              </div>
              <Badge variant="secondary">You</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Administration</CardTitle>
            <CardDescription>Manage system settings and configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Manage User Roles
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              System Analytics
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Database Management
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Security Settings
            </Button>

            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
