import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Consistent database types
export interface Profile {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "tp_officer" | "super_admin"
  enrollment_no?: string
  branch?: string
  year?: string
  phone?: string
  avatar_url?: string
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
  documents: string[]
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

// Common database functions
export async function getCurrentUser(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) throw error
  return data
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}
