"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "unauthorized":
        return {
          title: "Access Denied",
          description:
            "You don't have permission to access this resource. Please contact your administrator if you believe this is an error.",
        }
      case "Callback":
        return {
          title: "Authentication Failed",
          description: "There was an error during the authentication process. Please try signing in again.",
        }
      case "OAuthCallback":
        return {
          title: "OAuth Error",
          description: "There was an error with the OAuth provider. Please try again.",
        }
      default:
        return {
          title: "Authentication Error",
          description: error || "An unexpected error occurred during authentication. Please try again.",
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">{errorInfo.title}</CardTitle>
          <CardDescription className="text-gray-600">{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => router.push("/auth/signin")} className="w-full" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button onClick={() => router.push("/")} variant="outline" className="w-full" size="lg">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
