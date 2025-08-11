"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, XCircle, FileText, Briefcase, Calendar, UploadCloud, Info } from "lucide-react"

interface ApplicationStatus {
  id: string
  opportunityTitle: string
  companyName: string
  appliedDate: string
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  teacherComments?: string
  tpoComments?: string
  rejectionReason?: string
}

interface NOCStatus {
  id: string
  companyName: string
  internshipRole: string
  submittedDate: string
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  teacherComments?: string
  tpoComments?: string
  rejectionReason?: string
}

interface ReportStatus {
  id: string
  weekNumber: number
  title: string
  submittedDate: string
  status: "submitted" | "reviewed" | "approved" | "needs_revision"
  teacherComments?: string
}

interface CertificateStatus {
  id: string
  title: string
  issuer: string
  uploadedDate: string
  status: "pending" | "approved" | "rejected"
  tpoComments?: string
  rejectionReason?: string
}

const dummyApplications: ApplicationStatus[] = [
  {
    id: "app1",
    opportunityTitle: "Software Development Intern",
    companyName: "Tech Solutions Inc.",
    appliedDate: "2024-07-20",
    status: "approved_teacher",
    teacherComments: "Good resume, recommended for TPO review.",
  },
  {
    id: "app2",
    opportunityTitle: "Data Analyst Intern",
    companyName: "Global Insights Co.",
    appliedDate: "2024-07-15",
    status: "pending_teacher",
  },
  {
    id: "app3",
    opportunityTitle: "Marketing Intern",
    companyName: "Creative Minds Agency",
    appliedDate: "2024-07-10",
    status: "rejected",
    rejectionReason: "Skills mismatch with role requirements.",
  },
  {
    id: "app4",
    opportunityTitle: "UI/UX Design Intern",
    companyName: "Design Innovators",
    appliedDate: "2024-07-22",
    status: "pending_tpo",
    teacherComments: "Strong portfolio, forwarded to TPO.",
  },
]

const dummyNOCs: NOCStatus[] = [
  {
    id: "noc1",
    companyName: "Tech Solutions Inc.",
    internshipRole: "Software Engineer Intern",
    submittedDate: "2024-07-21",
    status: "approved_teacher",
    teacherComments: "All documents in order. Approved.",
  },
  {
    id: "noc2",
    companyName: "Global Innovations",
    internshipRole: "Data Analyst Intern",
    submittedDate: "2024-07-18",
    status: "pending_teacher",
  },
  {
    id: "noc3",
    companyName: "Startup X",
    internshipRole: "Business Development Intern",
    submittedDate: "2024-07-05",
    status: "rejected",
    rejectionReason: "Company not verified by TPO.",
  },
]

const dummyReports: ReportStatus[] = [
  {
    id: "rep1",
    weekNumber: 1,
    title: "Week 1 Progress Report",
    submittedDate: "2024-07-07",
    status: "approved",
    teacherComments: "Excellent progress, keep it up!",
  },
  {
    id: "rep2",
    weekNumber: 2,
    title: "Week 2 Progress Report",
    submittedDate: "2024-07-14",
    status: "needs_revision",
    teacherComments: "Please elaborate on challenges faced and solutions.",
  },
  {
    id: "rep3",
    weekNumber: 3,
    title: "Week 3 Progress Report",
    submittedDate: "2024-07-21",
    status: "submitted",
  },
]

const dummyCertificates: CertificateStatus[] = [
  {
    id: "cert1",
    title: "Full Stack Development",
    issuer: "Online Academy",
    uploadedDate: "2024-06-01",
    status: "approved",
    tpoComments: "Verified and added to student record.",
  },
  {
    id: "cert2",
    title: "Machine Learning Specialization",
    issuer: "Coursera",
    uploadedDate: "2024-07-10",
    status: "pending",
  },
]

export function StatusTracking() {
  const getApplicationStatusBadge = (status: ApplicationStatus["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Approved
          </Badge>
        )
      case "approved_teacher":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            Teacher Approved
          </Badge>
        )
      case "pending_teacher":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pending Teacher
          </Badge>
        )
      case "pending_tpo":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Pending TPO
          </Badge>
        )
      case "rejected":
      case "rejected_teacher":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getNOCStatusBadge = (status: NOCStatus["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Approved
          </Badge>
        )
      case "approved_teacher":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            Teacher Approved
          </Badge>
        )
      case "pending_teacher":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pending Teacher
          </Badge>
        )
      case "pending_tpo":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Pending TPO
          </Badge>
        )
      case "rejected":
      case "rejected_teacher":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getReportStatusBadge = (status: ReportStatus["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Approved
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Submitted
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-700">
            Reviewed
          </Badge>
        )
      case "needs_revision":
        return (
          <Badge variant="warning" className="bg-orange-100 text-orange-700">
            Needs Revision
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCertificateStatusBadge = (status: CertificateStatus["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Status Tracking</CardTitle>
        <CardDescription>Monitor the progress of your applications, NOCs, reports, and certificates.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="nocs">NOC Requests</TabsTrigger>
            <TabsTrigger value="reports">Weekly Reports</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Internship Applications Status</h3>
            {dummyApplications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No internship applications submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {dummyApplications.map((app) => (
                  <Card key={app.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">
                          {app.opportunityTitle} at {app.companyName}
                        </p>
                      </div>
                      {getApplicationStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Applied on: {app.appliedDate}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Teacher Review:{" "}
                          {app.status.includes("teacher")
                            ? "In Progress"
                            : app.status.includes("approved")
                              ? "Completed"
                              : "Pending"}
                        </span>
                        {app.teacherComments && (
                          <span className="text-xs text-muted-foreground italic">({app.teacherComments})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          TPO Review:{" "}
                          {app.status.includes("tpo")
                            ? "In Progress"
                            : app.status === "approved"
                              ? "Completed"
                              : "Pending"}
                        </span>
                        {app.tpoComments && (
                          <span className="text-xs text-muted-foreground italic">({app.tpoComments})</span>
                        )}
                      </div>
                      {app.rejectionReason && (
                        <div className="flex items-center gap-2 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span>Rejected: {app.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nocs" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">NOC Request Status</h3>
            {dummyNOCs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No NOC requests submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {dummyNOCs.map((noc) => (
                  <Card key={noc.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">
                          {noc.internshipRole} at {noc.companyName}
                        </p>
                      </div>
                      {getNOCStatusBadge(noc.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Submitted on: {noc.submittedDate}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Teacher Approval:{" "}
                          {noc.status.includes("teacher")
                            ? "In Progress"
                            : noc.status.includes("approved")
                              ? "Completed"
                              : "Pending"}
                        </span>
                        {noc.teacherComments && (
                          <span className="text-xs text-muted-foreground italic">({noc.teacherComments})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          TPO Approval:{" "}
                          {noc.status.includes("tpo")
                            ? "In Progress"
                            : noc.status === "approved"
                              ? "Completed"
                              : "Pending"}
                        </span>
                        {noc.tpoComments && (
                          <span className="text-xs text-muted-foreground italic">({noc.tpoComments})</span>
                        )}
                      </div>
                      {noc.rejectionReason && (
                        <div className="flex items-center gap-2 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span>Rejected: {noc.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Reports Status</h3>
            {dummyReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No weekly reports submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {dummyReports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">
                          Week {report.weekNumber}: {report.title}
                        </p>
                      </div>
                      {getReportStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Submitted on: {report.submittedDate}</p>
                    {report.teacherComments && (
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="italic">Teacher Comment: {report.teacherComments}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Certificates Status</h3>
            {dummyCertificates.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No certificates uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {dummyCertificates.map((cert) => (
                  <Card key={cert.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UploadCloud className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">
                          {cert.title} from {cert.issuer}
                        </p>
                      </div>
                      {getCertificateStatusBadge(cert.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Uploaded on: {cert.uploadedDate}</p>
                    {cert.tpoComments && (
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="italic">TPO Comment: {cert.tpoComments}</span>
                      </div>
                    )}
                    {cert.rejectionReason && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <XCircle className="h-4 w-4" />
                        <span>Rejected: {cert.rejectionReason}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
