"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center flex-col space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <Button onClick={() => signIn("google")}>
        Sign in with Google
      </Button>
    </div>
  )
}
