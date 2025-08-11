export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      certificates: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          file_url: string
          id: string
          issuer: string
          rejection_reason: string | null
          status: string
          student_id: string
          title: string
          uploaded_at: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          file_url: string
          id?: string
          issuer: string
          rejection_reason?: string | null
          status?: string
          student_id: string
          title: string
          uploaded_at?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          file_url?: string
          id?: string
          issuer?: string
          rejection_reason?: string | null
          status?: string
          student_id?: string
          title?: string
          uploaded_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          contact_email: string
          contact_person: string
          contact_phone: string | null
          created_at: string
          description: string | null
          documents: string[] | null
          employee_count: string | null
          founded_year: string | null
          id: string
          industry: string | null
          name: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email: string
          contact_person: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          documents?: string[] | null
          employee_count?: string | null
          founded_year?: string | null
          id?: string
          industry?: string | null
          name: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          documents?: string[] | null
          employee_count?: string | null
          founded_year?: string | null
          id?: string
          industry?: string | null
          name?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          additional_documents: string[] | null
          applied_at: string
          cover_letter: string | null
          created_at: string
          id: string
          opportunity_id: string
          rejection_reason: string | null
          resume_url: string | null
          status: string
          student_id: string
          teacher_approval_at: string | null
          teacher_rejection_at: string | null
          tpo_approval_at: string | null
          tpo_rejection_at: string | null
          updated_at: string
        }
        Insert: {
          additional_documents?: string[] | null
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          opportunity_id: string
          rejection_reason?: string | null
          resume_url?: string | null
          status?: string
          student_id: string
          teacher_approval_at?: string | null
          teacher_rejection_at?: string | null
          tpo_approval_at?: string | null
          tpo_rejection_at?: string | null
          updated_at?: string
        }
        Update: {
          additional_documents?: string[] | null
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          opportunity_id?: string
          rejection_reason?: string | null
          resume_url?: string | null
          status?: string
          student_id?: string
          teacher_approval_at?: string | null
          teacher_rejection_at?: string | null
          tpo_approval_at?: string | null
          tpo_rejection_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "internship_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internship_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_opportunities: {
        Row: {
          company_id: string
          created_at: string
          current_applicants: number
          description: string
          duration: string | null
          eligibility_criteria: string | null
          end_date: string | null
          id: string
          location: string | null
          max_applicants: number | null
          mode: string
          posted_by: string | null
          skills_required: string[] | null
          start_date: string | null
          status: string
          stipend: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_applicants?: number
          description: string
          duration?: string | null
          eligibility_criteria?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          max_applicants?: number | null
          mode?: string
          posted_by?: string | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: string
          stipend?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_applicants?: number
          description?: string
          duration?: string | null
          eligibility_criteria?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          max_applicants?: number | null
          mode?: string
          posted_by?: string | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: string
          stipend?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internship_opportunities_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      noc_requests: {
        Row: {
          company_address: string | null
          company_contact_email: string | null
          company_contact_phone: string | null
          company_name: string
          created_at: string
          description: string | null
          documents: string[] | null
          end_date: string
          id: string
          internship_duration: string
          internship_location: string | null
          internship_role: string
          priority: string
          rejection_reason: string | null
          start_date: string
          status: string
          stipend: string | null
          student_id: string
          teacher_approval_at: string | null
          teacher_rejection_at: string | null
          teacher_signature: string | null
          tpo_approval_at: string | null
          tpo_rejection_at: string | null
          updated_at: string
        }
        Insert: {
          company_address?: string | null
          company_contact_email?: string | null
          company_contact_phone?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          documents?: string[] | null
          end_date: string
          id?: string
          internship_duration: string
          internship_location?: string | null
          internship_role: string
          priority?: string
          rejection_reason?: string | null
          start_date: string
          status?: string
          stipend?: string | null
          student_id: string
          teacher_approval_at?: string | null
          teacher_rejection_at?: string | null
          teacher_signature?: string | null
          tpo_approval_at?: string | null
          tpo_rejection_at?: string | null
          updated_at?: string
        }
        Update: {
          company_address?: string | null
          company_contact_email?: string | null
          company_contact_phone?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          documents?: string[] | null
          end_date?: string
          id?: string
          internship_duration?: string
          internship_location?: string | null
          internship_role?: string
          priority?: string
          rejection_reason?: string | null
          start_date?: string
          status?: string
          stipend?: string | null
          student_id?: string
          teacher_approval_at?: string | null
          teacher_rejection_at?: string | null
          teacher_signature?: string | null
          tpo_approval_at?: string | null
          tpo_rejection_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "noc_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          created_at: string
          department: string | null
          email: string
          enrollment_no: string | null
          id: string
          name: string | null
          phone: string | null
          role: string
          updated_at: string
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          department?: string | null
          email: string
          enrollment_no?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          department?: string | null
          email?: string
          enrollment_no?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          created_at: string
          description: string
          file_url: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          student_id: string
          submitted_at: string
          teacher_comments: string | null
          title: string
          updated_at: string
          week_number: number
        }
        Insert: {
          created_at?: string
          description: string
          file_url?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          student_id: string
          submitted_at?: string
          teacher_comments?: string | null
          title: string
          updated_at?: string
          week_number: number
        }
        Update: {
          created_at?: string
          description?: string
          file_url?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          student_id?: string
          submitted_at?: string
          teacher_comments?: string | null
          title?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: any // Trigger
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
