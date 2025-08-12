import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    console.log("Debug - Session:", session)

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "No session found",
          session: null,
        },
        { status: 401 },
      )
    }

    // Try to fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", session.user.email)
      .single()

    console.log("Debug - Profile:", profile)
    console.log("Debug - Profile Error:", profileError)

    return NextResponse.json({
      session: {
        user: session.user,
        expires: session.expires,
      },
      profile,
      profileError,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug API Error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
