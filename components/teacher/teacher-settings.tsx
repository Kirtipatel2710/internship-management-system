"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Save, Bell, Shield, Eye, Download } from "lucide-react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export function TeacherSettings() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    bio: "",
    avatar_url: "",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    nocRequests: true,
    applicationUpdates: true,
    weeklyReports: false,
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("email", session?.user?.email).single()

      if (error) throw error

      if (data) {
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          department: data.department || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          phone: profile.phone,
          department: profile.department,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("email", session?.user?.email)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || session?.user?.image || ""} />
                  <AvatarFallback className="text-lg">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={profile.email} disabled className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    placeholder="Enter your department"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>NOC Requests</Label>
                  <p className="text-sm text-gray-500">Get notified when students submit NOC requests</p>
                </div>
                <Switch
                  checked={notifications.nocRequests}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, nocRequests: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Application Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about internship application updates</p>
                </div>
                <Switch
                  checked={notifications.applicationUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, applicationUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Teacher Account</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Security</p>
                  <p className="text-sm text-gray-500">Protected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View Activity Log
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Contact support if you need assistance with your account or have any questions.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
