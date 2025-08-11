import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// NOC Requests functions for teachers
export async function getTeacherNOCRequests(status?: string) {
  let query = supabase
    .from("noc_requests")
    .select(`
      *,
      profiles:student_id (
        name,
        email,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    if (status === "pending") {
      query = query.eq("status", "pending_teacher")
    } else if (status === "approved") {
      query = query.eq("status", "approved")
    } else if (status === "rejected") {
      query = query.eq("status", "rejected_teacher")
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateTeacherNOCStatus(id: string, status: "approved" | "rejected_teacher", reason?: string) {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updates.teacher_approval_at = new Date().toISOString()
    updates.teacher_signature = "Approved by Teacher"
  } else if (status === "rejected_teacher") {
    updates.teacher_rejection_at = new Date().toISOString()
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("noc_requests").update(updates).eq("id", id).select()

  if (error) throw error
  return data
}

// Internship Applications functions for teachers
export async function getTeacherInternshipApplications(status?: string) {
  let query = supabase
    .from("internship_applications")
    .select(`
      *,
      profiles:student_id (
        name,
        email,
        avatar_url
      ),
      internship_opportunities:opportunity_id (
        title,
        company_name,
        location,
        stipend,
        mode
      )
    `)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    if (status === "pending") {
      query = query.eq("status", "pending_teacher")
    } else if (status === "approved") {
      query = query.eq("status", "approved")
    } else if (status === "rejected") {
      query = query.eq("status", "rejected_teacher")
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateTeacherApplicationStatus(
  id: string,
  status: "approved" | "rejected_teacher",
  reason?: string,
) {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updates.teacher_approval_at = new Date().toISOString()
  } else if (status === "rejected_teacher") {
    updates.teacher_rejection_at = new Date().toISOString()
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("internship_applications").update(updates).eq("id", id).select()

  if (error) throw error
  return data
}

// Dashboard statistics for teachers
export async function getTeacherDashboardStats() {
  const [nocStats, applicationStats] = await Promise.all([
    supabase.from("noc_requests").select("status"),
    supabase.from("internship_applications").select("status"),
  ])

  const stats = {
    nocs: {
      total: nocStats.data?.length || 0,
      pending: nocStats.data?.filter((n) => n.status === "pending_teacher").length || 0,
      approved: nocStats.data?.filter((n) => n.status === "approved").length || 0,
      rejected: nocStats.data?.filter((n) => n.status === "rejected_teacher").length || 0,
    },
    applications: {
      total: applicationStats.data?.length || 0,
      pending: applicationStats.data?.filter((a) => a.status === "pending_teacher").length || 0,
      approved: applicationStats.data?.filter((a) => a.status === "approved").length || 0,
      rejected: applicationStats.data?.filter((a) => a.status === "rejected_teacher").length || 0,
    },
  }

  return stats
}

// Get recent activities for dashboard
export async function getTeacherRecentActivities() {
  const [recentNOCs, recentApplications] = await Promise.all([
    supabase
      .from("noc_requests")
      .select(`
        *,
        profiles:student_id (name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("internship_applications")
      .select(`
        *,
        profiles:student_id (name, email),
        internship_opportunities:opportunity_id (title, company_name)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return {
    recentNOCs: recentNOCs.data || [],
    recentApplications: recentApplications.data || [],
  }
}
