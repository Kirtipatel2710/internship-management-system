import {
  supabase,
  type NOCRequest,
  type Company,
  type InternshipOpportunity,
  type InternshipApplication,
} from "./supabase-consistent"

// NOC Management Functions
export async function getTpOfficerNOCRequests(status?: string): Promise<NOCRequest[]> {
  let query = supabase
    .from("noc_requests")
    .select(`
      *,
      profiles:student_id (
        name,
        email,
        enrollment_no,
        branch,
        year
      )
    `)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    if (status === "pending") {
      query = query.eq("status", "pending_tpo")
    } else if (status === "approved") {
      query = query.eq("status", "approved")
    } else if (status === "rejected") {
      query = query.eq("status", "rejected")
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateTpOfficerNOCStatus(
  id: string,
  status: "approved" | "rejected",
  reason?: string,
): Promise<NOCRequest> {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updates.tpo_approval_at = new Date().toISOString()
  } else if (status === "rejected") {
    updates.tpo_rejection_at = new Date().toISOString()
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("noc_requests").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

// Company Management Functions
export async function getTpOfficerCompanies(status?: string): Promise<Company[]> {
  let query = supabase.from("companies").select("*").order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateTpOfficerCompanyStatus(
  id: string,
  status: "verified" | "rejected",
  reason?: string,
): Promise<Company> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "verified") {
    updates.verified_by = user?.id
    updates.verified_at = new Date().toISOString()
  } else if (status === "rejected") {
    updates.rejected_by = user?.id
    updates.rejected_at = new Date().toISOString()
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("companies").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function getVerifiedCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, industry")
    .eq("status", "verified")
    .order("name")

  if (error) throw error
  return data || []
}

// Internship Opportunities Management
export async function getTpOfficerInternshipOpportunities(status?: string): Promise<InternshipOpportunity[]> {
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
  return data || []
}

export async function createTpOfficerInternshipOpportunity(
  opportunity: Partial<InternshipOpportunity>,
): Promise<InternshipOpportunity> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("internship_opportunities")
    .insert({
      ...opportunity,
      posted_by: user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTpOfficerInternshipOpportunity(
  id: string,
  updates: Partial<InternshipOpportunity>,
): Promise<InternshipOpportunity> {
  const { data, error } = await supabase
    .from("internship_opportunities")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTpOfficerInternshipOpportunity(id: string): Promise<void> {
  const { error } = await supabase.from("internship_opportunities").delete().eq("id", id)

  if (error) throw error
}

// Application Management Functions
export async function getTpOfficerInternshipApplications(status?: string): Promise<InternshipApplication[]> {
  let query = supabase
    .from("internship_applications")
    .select(`
      *,
      profiles:student_id (
        name,
        email,
        enrollment_no,
        branch,
        year
      ),
      internship_opportunities:opportunity_id (
        title,
        companies (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    if (status === "pending") {
      query = query.eq("status", "pending_tpo")
    } else if (status === "approved") {
      query = query.eq("status", "approved")
    } else if (status === "rejected") {
      query = query.eq("status", "rejected")
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateTpOfficerApplicationStatus(
  id: string,
  status: "approved" | "rejected",
  reason?: string,
): Promise<InternshipApplication> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updates.tpo_approval_at = new Date().toISOString()
  } else if (status === "rejected") {
    updates.tpo_rejection_at = new Date().toISOString()
    updates.rejection_reason = reason
  }

  const { data, error } = await supabase.from("internship_applications").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

// Dashboard Statistics
export async function getTpOfficerDashboardStats() {
  const [nocStats, companyStats, opportunityStats, applicationStats] = await Promise.all([
    supabase.from("noc_requests").select("status"),
    supabase.from("companies").select("status"),
    supabase.from("internship_opportunities").select("status, current_applicants"),
    supabase.from("internship_applications").select("status"),
  ])

  const stats = {
    nocs: {
      total: nocStats.data?.length || 0,
      pending: nocStats.data?.filter((n) => n.status === "pending_tpo").length || 0,
      approved: nocStats.data?.filter((n) => n.status === "approved").length || 0,
      rejected: nocStats.data?.filter((n) => n.status === "rejected").length || 0,
    },
    companies: {
      total: companyStats.data?.length || 0,
      pending: companyStats.data?.filter((c) => c.status === "pending").length || 0,
      verified: companyStats.data?.filter((c) => c.status === "verified").length || 0,
      rejected: companyStats.data?.filter((c) => c.status === "rejected").length || 0,
    },
    opportunities: {
      total: opportunityStats.data?.length || 0,
      active: opportunityStats.data?.filter((o) => o.status === "active").length || 0,
      closed: opportunityStats.data?.filter((o) => o.status === "closed").length || 0,
      totalApplications: opportunityStats.data?.reduce((sum, o) => sum + (o.current_applicants || 0), 0) || 0,
    },
    applications: {
      total: applicationStats.data?.length || 0,
      pending: applicationStats.data?.filter((a) => a.status === "pending_tpo").length || 0,
      approved: applicationStats.data?.filter((a) => a.status === "approved").length || 0,
      rejected: applicationStats.data?.filter((a) => a.status === "rejected").length || 0,
    },
  }

  return stats
}

// Recent Activities
export async function getTpOfficerRecentActivities() {
  const [recentNOCs, recentCompanies, recentApplications] = await Promise.all([
    supabase
      .from("noc_requests")
      .select(`
        *,
        profiles:student_id (name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("companies").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(3),
    supabase
      .from("internship_applications")
      .select(`
        *,
        profiles:student_id (name, email),
        internship_opportunities:opportunity_id (
          title,
          companies (name)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return {
    recentNOCs: recentNOCs.data || [],
    recentCompanies: recentCompanies.data || [],
    recentApplications: recentApplications.data || [],
  }
}
