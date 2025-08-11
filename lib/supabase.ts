import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  name?: string
  role: "student" | "teacher" | "tp_officer" | "super_admin"
  enrollment_no?: string
  branch?: string
  year?: string
  phone?: string
  avatar_url?: string
  department?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  industry?: string
  website?: string
  contact_person: string
  contact_email: string
  contact_phone?: string
  address?: string
  description?: string
  employee_count?: string
  founded_year?: string
  status: "pending" | "verified" | "rejected"
  documents: string[]
  verified_by?: string
  verified_at?: string
  rejected_by?: string
  rejected_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface InternshipOpportunity {
  id: string
  company_id: string
  title: string
  description: string
  location?: string
  mode: "onsite" | "remote" | "hybrid"
  duration?: string
  stipend?: string
  start_date?: string
  end_date?: string
  skills_required: string[]
  eligibility_criteria?: string
  max_applicants: number
  current_applicants: number
  status: "active" | "closed" | "draft"
  posted_by?: string
  created_at: string
  updated_at: string
  companies?: Company
}

export interface NOCRequest {
  id: string
  student_id: string
  company_name: string
  company_address?: string
  company_contact_email?: string
  company_contact_phone?: string
  internship_role: string
  internship_duration: string
  internship_location?: string
  start_date: string
  end_date: string
  stipend?: string
  description?: string
  offer_letter_url?: string
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  teacher_approval_at?: string
  teacher_rejection_at?: string
  teacher_signature?: string
  tpo_approval_at?: string
  tpo_rejection_at?: string
  rejection_reason?: string
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface InternshipApplication {
  id: string
  student_id: string
  opportunity_id: string
  cover_letter?: string
  resume_url?: string
  additional_documents: string[]
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  teacher_approval_at?: string
  teacher_rejection_at?: string
  tpo_approval_at?: string
  tpo_rejection_at?: string
  rejection_reason?: string
  applied_at: string
  created_at: string
  updated_at: string
  profiles?: Profile
  internship_opportunities?: InternshipOpportunity
}

export interface WeeklyReport {
  id: string
  student_id: string
  week_number: number
  week_start_date: string
  week_end_date: string
  file_url: string
  comments?: string
  status: "pending_review" | "approved" | "needs_changes"
  teacher_feedback?: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Certificate {
  id: string
  student_id: string
  internship_title: string
  company_name: string
  file_url: string
  status: "pending_review" | "approved" | "rejected"
  notes?: string
  submitted_at: string
  approved_at?: string
  approved_by?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

// Auth helper functions
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("Google sign-in error:", error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Sign in error:", error)
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Sign out error:", error)
      throw error
    }

    return { error: null }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Get user error:", userError)
      return { user: null, profile: null, error: userError }
    }

    if (!user) {
      return { user: null, profile: null, error: null }
    }

    // Try to get existing profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code === "PGRST116") {
      // Profile doesn't exist, create one
      const { data: newProfile, error: createError } = await createUserProfile(user)
      if (createError) {
        console.error("Error creating profile:", createError)
        return { user, profile: null, error: createError }
      }
      return { user, profile: newProfile, error: null }
    }

    if (profileError) {
      console.error("Get profile error:", profileError)
      return { user, profile: null, error: profileError }
    }

    return { user, profile, error: null }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { user: null, profile: null, error }
  }
}

// Function to create user profile
export async function createUserProfile(user: any) {
  try {
    const role = assignRoleByEmail(user.email)
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split("@")[0],
        avatar_url: user.user_metadata?.avatar_url,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
    return { data, error: null }
  } catch (error) {
    console.error("Create user profile error:", error)
    return { data: null, error }
  }
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Update profile error:", error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error("Update profile error:", error)
    return { data: null, error }
  }
}

// Role assignment based on email domain
export function assignRoleByEmail(email: string): "student" | "teacher" | "tp_officer" | "super_admin" {
  if (email === "tp.officer@charusat.ac.in") return "tp_officer"
  if (email === "admin@charusat.ac.in") return "super_admin"
  if (email.endsWith("@charusat.ac.in")) return "teacher"
  if (email.endsWith("@charusat.edu.in")) return "student"
  return "student" // default
}

// File upload helper
export async function uploadFile(file: File, bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error("File upload error:", error)
    return { url: null, error }
  }
}

// Helper function to check if user is authenticated
export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user || null
}

// Helper function to check user role
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    return null
  }

  return { user, profile }
}
