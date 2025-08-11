"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Profile, updateProfile, getCurrentUser } from "@/lib/supabase"
import { toast } from "@/components/ui/sonner"
import { Loader2 } from "lucide-react"

export function TeacherSettings() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      const { profile: fetchedProfile, error } = await getCurrentUser()
      if (error) {
        toast.error("Failed to load profile", {
          description: error.message,
        })
      } else if (fetchedProfile) {
        setProfile(fetchedProfile)
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSelectChange = (id: keyof Profile, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSave = async () => {
    if (!profile) return

    setIsLoading(true)
    const { data, error } = await updateProfile(profile.id, {
      name: profile.name,
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
      setProfile(data)
      setIsEditing(false)
    }
    setIsLoading(false)
  }

  if (isLoading || !profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Settings...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Teacher Settings</CardTitle>
          <CardDescription>Manage your profile and preferences.</CardDescription>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={profile.name || ""} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={profile.phone || ""} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={profile.department || ""} onChange={handleChange} disabled={!isEditing} />
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
