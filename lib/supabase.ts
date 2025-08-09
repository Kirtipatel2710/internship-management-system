import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          image: string | null
          role: "student" | "teacher" | "tp_officer" | "super_admin"
          department: string | null
          student_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          image?: string | null
          role: "student" | "teacher" | "tp_officer" | "super_admin"
          department?: string | null
          student_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          image?: string | null
          role?: "student" | "teacher" | "tp_officer" | "super_admin"
          department?: string | null
          student_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      internships: {
        Row: {
          id: string
          student_id: string
          company_name: string
          position: string
          start_date: string
          end_date: string
          status: "pending" | "approved" | "rejected" | "completed"
          description: string | null
          supervisor_id: string | null
          created_at: string
          updated_at: string
        }
      }
      applications: {
        Row: {
          id: string
          student_id: string
          internship_id: string
          cover_letter: string | null
          resume_url: string | null
          status: "submitted" | "under_review" | "accepted" | "rejected"
          applied_at: string
        }
      }
    }
  }
}
