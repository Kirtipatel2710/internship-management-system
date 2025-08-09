"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Building2,
  Users,
  Shield,
  Loader2,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Award,
  TrendingUp,
  Globe,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // User is logged in, fetch their profile to get the role
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (error && error.code === "PGRST116") {
          // No row found - user just signed up via OAuth and their profile isn't in 'profiles' yet.
          // Create the profile with a default role and then redirect.
          const email = session.user.email || ""
          let role: "student" | "teacher" | "tp_officer" | "super_admin" = "student"

          // Check email domain for role assignment
          if (email.endsWith("@charusat.ac.in")) {
            // Check for pre-registered special roles
            if (email === "tp.officer@charusat.ac.in") {
              role = "tp_officer"
            } else if (email === "admin@charusat.ac.in") {
              role = "super_admin"
            } else {
              role = "teacher" // Default for .ac.in domain
            }
          } else if (email.endsWith("@charusat.edu.in")) {
            role = "student" // Default for .edu.in domain
          } else {
            // Invalid domain - sign out and show error
            await supabase.auth.signOut()
            router.push("/auth/error?error=invalid_domain")
            return
          }

          const { error: insertError } = await supabase.from("profiles").insert({
            id: session.user.id,
            email: email,
            name: session.user.user_metadata.full_name || session.user.email,
            avatar_url: session.user.user_metadata.avatar_url,
            role: role,
          })

          if (insertError) {
            console.error("Error inserting new profile:", insertError)
            await supabase.auth.signOut()
            router.push("/auth/error?error=ProfileCreationFailed")
            return
          }
          router.push(`/dashboard/${role}`)
        } else if (profile) {
          router.push(`/dashboard/${profile.role}`)
        } else if (error) {
          console.error("Error fetching profile:", error)
          await supabase.auth.signOut()
          router.push("/auth/error?error=ProfileFetchFailed")
        }
      } else {
        setLoading(false) // Not logged in, show sign-in button
      }
    })

    // Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleSignIn = async () => {
    setSigningIn(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("Error signing in:", error)
      setSigningIn(false)
      router.push(`/auth/error?error=${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IMS</h1>
                <p className="text-xs text-gray-500">Internship Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                <Globe className="h-3 w-3 mr-1" />
                CHARUSAT University
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Internship Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                System
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your internship journey with our comprehensive platform designed for
              <span className="font-semibold text-blue-600"> CHARUSAT University</span>. Manage applications, track
              progress, and achieve your career goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleSignIn}
                disabled={signingIn}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {signingIn ? (
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
                    Sign In with Google
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500">Use your @charusat.edu.in or @charusat.ac.in email</p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Designed for Every Role</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform caters to all stakeholders in the internship ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Students</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Apply for internships, track applications, submit reports, and manage your internship journey
                  seamlessly
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">
                    Applications
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Reports
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Certificates
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Teachers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Supervise student internships, review reports, provide guidance, and track student progress
                  effectively
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">
                    Supervision
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Reviews
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Guidance
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">T&P Officers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Manage internship programs, coordinate with companies, oversee placements, and maintain industry
                  relations
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">
                    Programs
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Companies
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Placements
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Administrators</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Full system access, user management, comprehensive oversight, and system configuration control
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">
                    Management
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Oversight
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Configuration
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by CHARUSAT Community</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of students and faculty already using our platform
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">1,200+</div>
              <div className="text-blue-200">Active Students</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-blue-200">Partner Companies</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-200">Success Rate</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-blue-200" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Internship Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the CHARUSAT community and take the first step towards your career success
          </p>

          <Button
            onClick={handleSignIn}
            disabled={signingIn}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IMS</h3>
                  <p className="text-sm text-gray-400">Internship Management System</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering CHARUSAT students to achieve their career goals through seamless internship management.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About CHARUSAT</li>
                <li>Support</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>help@charusat.ac.in</li>
                <li>+91 2697 265011</li>
                <li>CHARUSAT Campus</li>
                <li>Changa, Gujarat</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CHARUSAT University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
