export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: "student" | "teacher" | "tp_officer" | "super_admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role: "student" | "teacher" | "tp_officer" | "super_admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: "student" | "teacher" | "tp_officer" | "super_admin"
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          title: string
          description: string
          company_name: string
          location: string | null
          stipend: string | null
          application_deadline: string | null
          posted_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          company_name: string
          location?: string | null
          stipend?: string | null
          application_deadline?: string | null
          posted_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          company_name?: string
          location?: string | null
          stipend?: string | null
          application_deadline?: string | null
          posted_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      noc_requests: {
        Row: {
          id: string
          student_id: string
          company_name: string
          position: string
          start_date: string
          end_date: string
          status: "pending" | "approved" | "rejected"
          file_url: string | null
          requested_at: string
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          company_name: string
          position: string
          start_date: string
          end_date: string
          status?: "pending" | "approved" | "rejected"
          file_url?: string | null
          requested_at?: string
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          company_name?: string
          position?: string
          start_date?: string
          end_date?: string
          status?: "pending" | "approved" | "rejected"
          file_url?: string | null
          requested_at?: string
          approved_by?: string | null
          approved_at?: string | null
        }
      }
      weekly_reports: {
        Row: {
          id: string
          student_id: string
          week_no: number
          file_url: string
          status: "submitted" | "reviewed"
          comment: string | null
          submitted_at: string
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          week_no: number
          file_url: string
          status?: "submitted" | "reviewed"
          comment?: string | null
          submitted_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          week_no?: number
          file_url?: string
          status?: "submitted" | "reviewed"
          comment?: string | null
          submitted_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
      }
      certificates: {
        Row: {
          id: string
          student_id: string
          file_url: string
          status: "pending" | "approved" | "rejected"
          submitted_at: string
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          file_url: string
          status?: "pending" | "approved" | "rejected"
          submitted_at?: string
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          file_url?: string
          status?: "pending" | "approved" | "rejected"
          submitted_at?: string
          approved_by?: string | null
          approved_at?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          verified_by: string | null
          verified_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          verified_by?: string | null
          verified_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          verified_by?: string | null
          verified_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
