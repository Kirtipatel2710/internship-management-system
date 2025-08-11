"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    } else {
      setError("An unknown authentication error occurred")
    }
  }, [searchParams])

  const handleRetry = () => {
    router.push("/")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const getErrorMessage = (error: string) => {
    if (error.includes("Profile not created")) {
      return {
        title: "Account Setup Issue",
        description:
          "There was an issue setting up your account. This might happen if your email domain is not recognized or there's a temporary server issue.",
        suggestions: [
          "Make sure you're using a valid @charusat.edu.in or @charusat.ac.in email address",
          "Wait a moment and try signing in again",
          "Contact support if the issue persists",
        ],
      }
    }

    if (error.includes("Failed to load user profile")) {
      return {
        title: "Profile Loading Error",
        description: "We couldn't load your user profile. This might be a temporary issue.",
        suggestions: [
          "Try refreshing the page",
          "Clear your browser cache and try again",
          "Contact support if the issue persists",
        ],
      }
    }

    if (error.includes("OAuth")) {
      return {
        title: "Google Authentication Error",
        description: "There was an issue with Google authentication.",
        suggestions: [
          "Make sure you're using a valid Google account",
          "Check if third-party cookies are enabled",
          "Try using an incognito/private browsing window",
        ],
      }
    }

    return {
      title: "Authentication Error",
      description: error || "An unexpected error occurred during sign in.",
      suggestions: [
        "Try signing in again",
        "Make sure you have a stable internet connection",
        "Contact support if the issue persists",
      ],
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{errorInfo.title}</CardTitle>
          <CardDescription className="text-gray-600 mt-2">{errorInfo.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error Details:</strong> {error}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What you can try:</h3>
            <ul className="space-y-2">
              {errorInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button variant="outline" onClick={handleGoHome} className="flex-1 bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Still having issues?{" "}
              <a href="mailto:support@charusat.ac.in" className="text-blue-600 hover:text-blue-500 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
