// 1. FIXED SIGNIN PAGE (app/auth/signin/page.tsx)
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      
      // Replace this with your actual authentication logic
      // This should match what getCurrentUser() expects
      
      // Example if using Supabase:
      // const { data, error } = await supabase.auth.signInWithOAuth({
      //   provider: 'google',
      //   options: {
      //     redirectTo: `${window.location.origin}/auth/callback`
      //   }
      // })
      
      // For now, simulate successful login for dev
      toast.success("Signing in...")
      
      // Redirect based on user role - you'll need to determine this after actual auth
      setTimeout(() => {
        router.push("/dashboard/student") // or "/dashboard/tp_officer"
      }, 1000)
      
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Sign in failed", {
        description: "Please try again"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in with Google"
            )}
          </Button>
          
          {/* Dev override for testing */}
          <Button 
            onClick={() => {
              // Simulate TP Officer login for testing
              toast.success("Dev login as TP Officer")
              router.push("/dashboard/tp_officer")
            }}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Dev: Login as TP Officer
          </Button>
          
          <Button 
            onClick={() => {
              // Simulate Student login for testing
              toast.success("Dev login as Student")
              router.push("/dashboard/student")
            }}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Dev: Login as Student
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}