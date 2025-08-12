"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Building2,
  Users,
  Shield,
  Loader2,
  ArrowRight,
  Globe,
  Star,
  Zap,
  Lock,
  CheckCircle,
} from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/auth/callback")
    }
  }, [session, status, router])

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/auth/callback",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setLoading(false)
    }
  }

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  IMS
                </h1>
                <p className="text-xs text-gray-500">Internship Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex bg-white/50 border-blue-200">
                <Globe className="h-3 w-3 mr-1 text-blue-600" />
                CHARUSAT University
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</CardTitle>
              <CardDescription className="text-lg text-gray-600">Sign in to your CHARUSAT IMS account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                onClick={handleSignIn}
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Use your <span className="font-semibold">@charusat.edu.in</span> or{" "}
                <span className="font-semibold">@charusat.ac.in</span> email address
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-indigo-500" />
                  <span>Reliable</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Information */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: Users,
                title: "Teachers",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Building2,
                title: "T&P Officers",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: Shield,
                title: "Admins",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50",
              },
            ].map((role, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${role.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <role.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{role.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
