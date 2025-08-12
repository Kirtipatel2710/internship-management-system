"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { supabase, assignRoleByEmail } from "@/lib/supabase"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthCallback() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState("authenticating")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleCallback = async () => {
      try {
        if (status === "loading") return

        if (status === "unauthenticated") {
          console.log("No session found, redirecting to signin")
          router.push("/auth/signin")
          return
        }

        if (!session?.user?.email) {
          setError("No user email found")
          return
        }

        console.log("Processing auth callback for:", session.user.email)
        setStep("creating_profile")

        // Check if user profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", session.user.email)
          .single()

        let userProfile = existingProfile

        // Create profile if it doesn't exist
        if (fetchError && fetchError.code === "PGRST116") {
          console.log("Creating new user profile...")

          const role = assignRoleByEmail(session.user.email)

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              email: session.user.email,
              name: session.user.name || session.user.email.split("@")[0],
              role: role,
              avatar_url: session.user.image,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (createError) {
            console.error("Error creating profile:", createError)
            setError("Failed to create user profile")
            return
          }

          userProfile = newProfile
        } else if (fetchError) {
          console.error("Error fetching profile:", fetchError)
          setError("Failed to fetch user profile")
          return
        }

        if (!userProfile) {
          setError("No user profile found")
          return
        }

        console.log("User profile:", userProfile)
        setStep("redirecting")

        // Small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Redirect based on role
        switch (userProfile.role) {
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
            console.log("Unknown role, defaulting to student dashboard")
            router.push("/dashboard/student")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setError("Authentication processing failed")
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [session, status, router, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/auth/signin")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStepInfo = () => {
    switch (step) {
      case "authenticating":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
          text: "Authenticating with Google",
          completed: false,
        }
      case "creating_profile":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
          text: "Setting up your profile",
          completed: false,
        }
      case "redirecting":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: "Redirecting to dashboard",
          completed: true,
        }
      default:
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
          text: "Processing...",
          completed: false,
        }
    }
  }

  const stepInfo = getStepInfo()

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
              {stepInfo.icon}
              <span className="ml-2">{stepInfo.text}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
