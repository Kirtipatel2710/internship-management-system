"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, signInWithGoogle } from "@/lib/supabase"
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
  Star,
  Zap,
  Lock,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Check if user has a profile
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

          if (profile?.role) {
            router.push(`/dashboard/${profile.role}`)
            return
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Session check error:", error)
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (!session && !loading)) {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, loading])

  const handleSignIn = async () => {
    setSigningIn(true)

    try {
      const { error } = await signInWithGoogle()

      if (error) {
        console.error("Sign in error:", error)
        setSigningIn(false)
        // The error will be handled by the auth callback
        return
      }

      // Don't set signingIn to false here as redirect will happen
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      setSigningIn(false)
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Internship
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">
                Management System
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your internship journey with our comprehensive platform designed for
              <span className="font-semibold text-blue-600"> CHARUSAT University</span>. Streamline applications, track
              progress, and unlock your career potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleSignIn}
                disabled={signingIn}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
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
                    Continue with Google
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Use your <span className="font-semibold">@charusat.edu.in</span> or{" "}
              <span className="font-semibold">@charusat.ac.in</span> email address
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-indigo-500" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
              Role-Based Access
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Designed for <span className="text-blue-600">Every Role</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides tailored experiences for all stakeholders in the internship ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                description:
                  "Apply for internships, track applications, submit reports, and manage your complete internship journey",
                features: ["Applications", "Reports", "Certificates", "Progress Tracking"],
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: BookOpen,
                title: "Teachers",
                description:
                  "Supervise student internships, review reports, provide guidance, and track student progress effectively",
                features: ["Supervision", "Reviews", "Guidance", "Mentoring"],
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Building2,
                title: "T&P Officers",
                description:
                  "Manage internship programs, coordinate with companies, oversee placements, and maintain industry relations",
                features: ["Programs", "Companies", "Placements", "Analytics"],
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: Shield,
                title: "Administrators",
                description:
                  "Complete system access, user management, comprehensive oversight, and system configuration control",
                features: ["Management", "Oversight", "Configuration", "Reports"],
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50",
              },
            ].map((role, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`flex items-center justify-center w-20 h-20 bg-gradient-to-r ${role.color} rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <role.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{role.title}</CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-6">
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {role.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {role.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="secondary"
                        className={`text-xs px-3 py-1 ${role.bgColor} hover:bg-opacity-80 transition-colors`}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by the <span className="text-yellow-300">CHARUSAT Community</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of students, faculty, and industry partners already transforming their internship
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "1,500+", label: "Active Students", color: "text-blue-200" },
              { icon: Building2, value: "200+", label: "Partner Companies", color: "text-indigo-200" },
              { icon: Award, value: "98%", label: "Success Rate", color: "text-purple-200" },
              { icon: TrendingUp, value: "24/7", label: "Support Available", color: "text-yellow-200" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors duration-300">
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-8">
            <Badge
              variant="outline"
              className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 text-sm px-4 py-2"
            >
              Ready to Get Started?
            </Badge>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Begin Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Internship Journey
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join the CHARUSAT community today and take the first step towards transforming your career with our
            comprehensive internship management platform
          </p>

          <Button
            onClick={handleSignIn}
            disabled={signingIn}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl"
          >
            {signingIn ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Getting Started...
              </>
            ) : (
              <>
                Get Started Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">IMS</h3>
                  <p className="text-sm text-gray-400">Internship Management System</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Empowering CHARUSAT students to achieve their career goals through seamless internship management and
                industry connections.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">About CHARUSAT</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Support Center</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Contact Info</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-blue-400 transition-colors">help@charusat.ac.in</li>
                <li className="hover:text-blue-400 transition-colors">+91 2697 265011</li>
                <li>
                  CHARUSAT Campus
                  <br />
                  Changa, Gujarat 388421
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              &copy; 2024 CHARUSAT University. All rights reserved. Built with ❤️ for students.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
