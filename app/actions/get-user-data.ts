"use server"

import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function getCurrentUserData() {
  const session = await auth()

  if (!session?.user?.userId) {
    return { error: "User not authenticated or user ID not found." }
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, role, department, student_id")
      .eq("id", session.user.userId)
      .single()

    if (error) {
      console.error("Error fetching user data:", error)
      return { error: "Failed to fetch user data." }
    }

    return { data }
  } catch (e) {
    console.error("Exception fetching user data:", e)
    return { error: "An unexpected error occurred." }
  }
}
