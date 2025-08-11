"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, UploadCloud, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/sonner"

interface NOCRequestItem {
  id: string
  companyName: string
  internshipRole: string
  status: "pending_teacher" | "approved_teacher" | "rejected_teacher" | "pending_tpo" | "approved" | "rejected"
  submittedDate: string
  rejectionReason?: string
}

const dummyNOCRequests: NOCRequestItem[] = [
  {
    id: "noc1",
    companyName: "Tech Solutions Inc.",
    internshipRole: "Software Engineer Intern",
    status: "pending_teacher",
    submittedDate: "2024-07-20",
  },
  {
    id: "noc2",
    companyName: "Global Innovations",
    internshipRole: "Data Analyst Intern",
    status: "approved",
    submittedDate: "2024-07-10",
  },
  {
    id: "noc3",
    companyName: "Creative Minds Agency",
    internshipRole: "Marketing Intern",
    status: "rejected",
    submittedDate: "2024-07-01",
    rejectionReason: "Incomplete documents provided.",
  },
  {
    id: "noc4",
    companyName: "Design Innovators",
    internshipRole: "UI/UX Designer Intern",
    status: "pending_tpo",
    submittedDate: "2024-07-25",
  },
]

export function NOCRequest() {
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")
  const [internshipRole, setInternshipRole] = useState("")
  const [internshipDuration, setInternshipDuration] = useState("")
  const [internshipLocation, setInternshipLocation] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [stipend, setStipend] = useState("")
  const [description, setDescription] = useState("")
  const [documents, setDocuments] = useState<File[]>([])
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  const [nocRequests, setNocRequests] = useState<NOCRequestItem[]>(dummyNOCRequests)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDocuments(Array.from(event.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || !internshipRole || !internshipDuration || !startDate || !endDate) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    const newNOC: NOCRequestItem = {
      id: `noc${nocRequests.length + 1}`,
      companyName,
      internshipRole,
      status: "pending_teacher", // Always starts as pending teacher
      submittedDate: new Date().toISOString().split("T")[0],
    }

    setNocRequests([...nocRequests, newNOC])
    toast.success("NOC Request Submitted", {
      description: "Your No Objection Certificate request has been submitted successfully.",
    })
    // Reset form
    setCompanyName("")
    setCompanyAddress("")
    setCompanyEmail("")
    setCompanyPhone("")
    setInternshipRole("")
    setInternshipDuration("")
    setInternshipLocation("")
    setStartDate(undefined)
    setEndDate(undefined)
    setStipend("")
    setDescription("")
    setDocuments([])
    setPriority("medium")
  }

  const getStatusIcon = (status: NOCRequestItem["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending_teacher":
      case "pending_tpo":
        return <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
      case "approved_teacher":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" /> // Teacher approved, pending TPO
      case "rejected_teacher":
        return <XCircle className="h-5 w-5 text-red-500" /> // Teacher rejected
      default:
        return null
    }
  }

  const getStatusText = (status: NOCRequestItem["status"]) => {
    switch (status) {
      case "approved":
        return "Approved by TPO"
      case "rejected":
        return "Rejected"
      case "pending_teacher":
        return "Pending Teacher Approval"
      case "approved_teacher":
        return "Approved by Teacher (Pending TPO)"
      case "rejected_teacher":
        return "Rejected by Teacher"
      case "pending_tpo":
        return "Pending TPO Approval"
      default:
        return "Unknown Status"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Request New NOC</CardTitle>
          <CardDescription>Fill out the form below to request an NOC for your internship.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g., Google, Microsoft"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input
                id="companyAddress"
                placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="companyEmail">Company Contact Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  placeholder="e.g., hr@company.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyPhone">Company Contact Phone</Label>
                <Input
                  id="companyPhone"
                  type="tel"
                  placeholder="e.g., +1234567890"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="internshipRole">Internship Role</Label>
              <Input
                id="internshipRole"
                placeholder="e.g., Software Engineer Intern"
                value={internshipRole}
                onChange={(e) => setInternshipRole(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="internshipDuration">Internship Duration</Label>
                <Input
                  id="internshipDuration"
                  placeholder="e.g., 3 months, 6 weeks"
                  value={internshipDuration}
                  onChange={(e) => setInternshipDuration(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="internshipLocation">Internship Location</Label>
                <Input
                  id="internshipLocation"
                  placeholder="e.g., Remote, New York, NY"
                  value={internshipLocation}
                  onChange={(e) => setInternshipLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stipend">Stipend (Optional)</Label>
              <Input
                id="stipend"
                placeholder="e.g., 15,000 INR/month"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Internship Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe your internship responsibilities."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="documents">Supporting Documents (e.g., Offer Letter)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, JPG, PNG (MAX. 5MB)</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} />
                </label>
              </div>
              {documents.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected files: {documents.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Submit NOC Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>My NOC Requests</CardTitle>
          <CardDescription>Track the status of your submitted No Objection Certificate requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {nocRequests.length === 0 ? (
            <p className="text-muted-foreground text-center">No NOC requests submitted yet.</p>
          ) : (
            <div className="grid gap-4">
              {nocRequests.map((request) => (
                <Card
                  key={request.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">{request.companyName}</p>
                      <p className="text-sm text-muted-foreground">{request.internshipRole}</p>
                      <p className="text-xs text-muted-foreground">Submitted: {request.submittedDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="text-sm font-medium">{getStatusText(request.status)}</span>
                    </div>
                    {request.rejectionReason && (
                      <p className="text-xs text-red-500 italic">Reason: {request.rejectionReason}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
