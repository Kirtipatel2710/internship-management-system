"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "access_denied":
        return "Access denied. Please ensure you are using a valid CHARUSAT email address (@charusat.edu.in or @charusat.ac.in)."
      case "invalid_domain":
        return "Invalid email domain. Please use a valid CHARUSAT email address (@charusat.edu.in or @charusat.ac.in)."
      case "ProfileCreationFailed":
        return "Failed to create user profile after sign-in. Please try again or contact support."
      case "ProfileFetchFailed":
        return "Failed to retrieve user profile. Please try again or contact support."
      default:
        return "An unexpected authentication error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">Authentication Error</CardTitle>
          <CardDescription className="text-gray-600">{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/">
            <Button className="w-full">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
