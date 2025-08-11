"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { type Profile, updateProfile } from "@/lib/supabase"
import { toast } from "@/components/ui/sonner"
import { Loader2 } from "lucide-react"

interface UserProfileCardProps {
  initialProfile: Profile
  onProfileUpdate: (updatedProfile: Profile) => void
}

export function UserProfileCard({ initialProfile, onProfileUpdate }: UserProfileCardProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setProfile(initialProfile)
  }, [initialProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    const { data, error } = await updateProfile(profile.id, {
      name: profile.name,
      enrollment_no: profile.enrollment_no,
      branch: profile.branch,
      year: profile.year,
      phone: profile.phone,
      department: profile.department,
    })

    if (error) {
      toast.error("Profile Update Failed", {
        description: error.message,
      })
    } else if (data) {
      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated.",
      })
      onProfileUpdate(data)
      setIsEditing(false)
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your personal and academic information.</CardDescription>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg?height=80&width=80&query=user avatar"}
              alt={profile.name || "User Avatar"}
            />
            <AvatarFallback>{profile.name ? profile.name[0] : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{profile.name || "N/A"}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground capitalize">Role: {profile.role.replace(/_/g, " ")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={profile.name || ""} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled />
          </div>
          {profile.role === "student" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="enrollment_no">Enrollment Number</Label>
                <Input
                  id="enrollment_no"
                  value={profile.enrollment_no || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" value={profile.branch || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={profile.year || ""}
                  onValueChange={(value) => handleSelectChange("year", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {(profile.role === "teacher" || profile.role === "student") && (
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={profile.department || ""} onChange={handleChange} disabled={!isEditing} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={profile.phone || ""} onChange={handleChange} disabled={!isEditing} />
          </div>
        </div>

        {isEditing && (
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
