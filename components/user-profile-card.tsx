"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUserData } from "@/app/actions/get-user-data"
import { User, Mail, Briefcase, GraduationCap, Loader2, Building2 } from "lucide-react"

interface UserData {
  id: string
  email: string
  name: string
  role: string
  department?: string | null
  student_id?: string | null
}

export function UserProfileCard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const result = await getCurrentUserData()
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setUserData(result.data)
      }
      setLoading(false)
    }
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading user data...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-red-600">Error: {error}</CardContent>
      </Card>
    )
  }

  if (!userData) {
    return (
      <Card>
        <CardContent className="p-6 text-gray-600">No user data found.</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile Information</CardTitle>
        <CardDescription>Details fetched directly from the database.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5 text-gray-600" />
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
        </div>
        <div className="flex items-center">
          <Mail className="mr-2 h-5 w-5 text-gray-600" />
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
        <div className="flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-gray-600" />
          <p>
            <strong>Role:</strong>{" "}
            {userData.role
              .replace(/_/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
        </div>
        {userData.department && (
          <div className="flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-gray-600" />
            <p>
              <strong>Department:</strong> {userData.department}
            </p>
          </div>
        )}
        {userData.student_id && (
          <div className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-gray-600" />
            <p>
              <strong>Student ID:</strong> {userData.student_id}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
