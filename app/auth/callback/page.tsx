"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasProcessed = useRef(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent duplicate processing
      if (hasProcessed.current) return
      hasProcessed.current = true

      try {
        // Handle the auth callback
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          router.push(`/auth/error?error=${encodeURIComponent(sessionError.message)}`)
          return
        }

        if (!sessionData.session?.user) {
          console.log("No session found")
          router.push("/")
          return
        }

        const user = sessionData.session.user
        console.log("User authenticated:", user.email)

        // Wait a moment for the database trigger to create the profile
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if profile exists and get it
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Profile error:", profileError)

          // If profile doesn't exist, redirect to error page
          if (profileError.code === "PGRST116") {
            router.push(`/auth/error?error=${encodeURIComponent("Profile not created. Please try signing in again.")}`)
            return
          }

          router.push(`/auth/error?error=${encodeURIComponent("Failed to load user profile")}`)
          return
        }

        if (!profile) {
          console.error("No profile found")
          router.push(`/auth/error?error=${encodeURIComponent("User profile not found")}`)
          return
        }

        console.log("Profile found:", profile.role)

        // Redirect based on role
        switch (profile.role) {
          case "student":
            router.push("/dashboard/student")
            break
          case "teacher":
            router.push("/dashboard/teacher")
            break
          case "tp_officer":
            router.push("/dashboard/tp_officer")
            break
          case "super_admin":
            router.push("/dashboard/super_admin")
            break
          default:
            router.push("/dashboard/student")
        }
      } catch (error) {
        console.error("Callback error:", error)
        router.push(`/auth/error?error=${encodeURIComponent("Authentication failed")}`)
      }
    }

    // Small delay to ensure the page is mounted
    const timeoutId = setTimeout(handleAuthCallback, 100)

    return () => clearTimeout(timeoutId)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>

          <p className="text-gray-600 mb-6">
            Please wait while we set up your account and redirect you to your dashboard.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Authenticating with Google
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-500" />
              Setting up your profile
            </div>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <div className="w-4 h-4 mr-2 rounded-full border-2 border-gray-300"></div>
              Redirecting to dashboard
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
