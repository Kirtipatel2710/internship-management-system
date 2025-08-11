import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// NOC Requests functions
export async function getNOCRequests(status?: string) {
  let query = supabase.from("noc_requests").select("*").order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateNOCStatus(id: string, status: "approved" | "rejected", reason?: string) {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updates.approved_date = new Date().toISOString()
    updates.approved_by = (await supabase.auth.getUser()).data.user?.id
  } else if (status === "rejected") {
    updates.rejected_date = new Date().toISOString()
    updates.rejected_by = (await supabase.auth.getUser()).data.user?.id
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("noc_requests").update(updates).eq("id", id).select()

  if (error) throw error
  return data
}

// Companies functions
export async function getCompanies(status?: string) {
  let query = supabase.from("companies").select("*").order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateCompanyStatus(id: string, status: "verified" | "rejected", reason?: string) {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "verified") {
    updates.verified_date = new Date().toISOString()
    updates.verified_by = (await supabase.auth.getUser()).data.user?.id
  } else if (status === "rejected") {
    updates.rejected_date = new Date().toISOString()
    updates.rejected_by = (await supabase.auth.getUser()).data.user?.id
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("companies").update(updates).eq("id", id).select()

  if (error) throw error
  return data
}

export async function getVerifiedCompanies() {
  const { data, error } = await supabase.from("companies").select("id, name").eq("status", "verified").order("name")

  if (error) throw error
  return data
}

// Internship Opportunities functions
export async function getInternshipOpportunities(status?: string) {
  let query = supabase
    .from("internship_opportunities")
    .select(`
      *,
      companies (
        name,
        industry
      )
    `)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createInternshipOpportunity(opportunity: any) {
  const { data, error } = await supabase
    .from("internship_opportunities")
    .insert({
      ...opportunity,
      posted_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()

  if (error) throw error
  return data
}

export async function updateInternshipOpportunity(id: string, updates: any) {
  const { data, error } = await supabase
    .from("internship_opportunities")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) throw error
  return data
}

export async function deleteInternshipOpportunity(id: string) {
  const { data, error } = await supabase.from("internship_opportunities").delete().eq("id", id)

  if (error) throw error
  return data
}

// Internship Applications functions
export async function getInternshipApplications(status?: string) {
  let query = supabase
    .from("internship_applications")
    .select(`
      *,
      internship_opportunities (
        title,
        companies (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateApplicationStatus(id: string, status: "approved" | "rejected", reason?: string) {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updates.approved_date = new Date().toISOString()
    updates.approved_by = (await supabase.auth.getUser()).data.user?.id
  } else if (status === "rejected") {
    updates.rejected_date = new Date().toISOString()
    updates.rejected_by = (await supabase.auth.getUser()).data.user?.id
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("internship_applications").update(updates).eq("id", id).select()

  if (error) throw error
  return data
}

// Dashboard statistics
export async function getDashboardStats() {
  const [nocStats, companyStats, internshipStats, applicationStats] = await Promise.all([
    supabase.from("noc_requests").select("status"),
    supabase.from("companies").select("status"),
    supabase.from("internship_opportunities").select("status, current_applicants"),
    supabase.from("internship_applications").select("status"),
  ])

  const stats = {
    nocs: {
      total: nocStats.data?.length || 0,
      pending: nocStats.data?.filter((n) => n.status === "pending").length || 0,
      approved: nocStats.data?.filter((n) => n.status === "approved").length || 0,
      rejected: nocStats.data?.filter((n) => n.status === "rejected").length || 0,
    },
    companies: {
      total: companyStats.data?.length || 0,
      pending: companyStats.data?.filter((c) => c.status === "pending").length || 0,
      verified: companyStats.data?.filter((c) => c.status === "verified").length || 0,
      rejected: companyStats.data?.filter((c) => c.status === "rejected").length || 0,
    },
    internships: {
      total: internshipStats.data?.length || 0,
      active: internshipStats.data?.filter((i) => i.status === "active").length || 0,
      closed: internshipStats.data?.filter((i) => i.status === "closed").length || 0,
      totalApplications: internshipStats.data?.reduce((sum, i) => sum + (i.current_applicants || 0), 0) || 0,
    },
    applications: {
      total: applicationStats.data?.length || 0,
      pending: applicationStats.data?.filter((a) => a.status === "pending").length || 0,
      approved: applicationStats.data?.filter((a) => a.status === "approved").length || 0,
      rejected: applicationStats.data?.filter((a) => a.status === "rejected").length || 0,
    },
  }

  return stats
}
