"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Building2,
  Sparkles,
  Trophy,
  Upload,
  Send,
} from "lucide-react"

export function NOCCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)

  const existingRequests = [
    {
      id: 1,
      title: "Summer Internship NOC - TechNova",
      company: "TechNova Solutions",
      requestDate: "2024-01-20",
      status: "approved",
      approvedBy: "Dr. Rajesh Kumar",
      approvedDate: "2024-01-22",
      documents: ["offer-letter.pdf", "company-profile.pdf"],
      remarks: "Excellent opportunity! Approved for summer internship program. Best wishes for your journey!",
      priority: "high",
    },
    {
      id: 2,
      title: "AI Research Internship NOC",
      company: "DataMind Analytics",
      requestDate: "2024-01-18",
      status: "pending",
      documents: ["research-proposal.pdf", "supervisor-recommendation.pdf"],
      remarks: "Under review by T&P coordinator. Additional documentation may be required.",
      priority: "medium",
    },
    {
      id: 3,
      title: "Mobile Development NOC",
      company: "AppCraft Studios",
      requestDate: "2024-01-15",
      status: "rejected",
      rejectedBy: "Prof. Priya Sharma",
      rejectedDate: "2024-01-17",
      documents: ["internship-agreement.pdf"],
      remarks: "Timing conflicts with semester schedule. Please reapply for next semester with adjusted dates.",
      priority: "low",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "badge-green"
      case "pending":
        return "badge-orange"
      case "rejected":
        return "badge-pink"
      default:
        return "badge-electric"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5" />
      case "pending":
        return <Clock className="h-5 w-5" />
      case "rejected":
        return <XCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-nature-gradient"
      case "pending":
        return "bg-sunset-gradient"
      case "rejected":
        return "bg-cosmic-gradient"
      default:
        return "bg-electric-gradient"
    }
  }

  const handleSubmitRequest = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowNewRequestForm(false)
    // Show success toast
  }

  return (
    <div className="w-full space-y-8">
      {/* Hero Header */}
      <div className="gradient-card bg-nature-gradient rounded-3xl p-8 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-6 right-6 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-6 left-6 w-24 h-24 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl animate-pulse-glow">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">NOC Center 📋</h1>
                  <p className="text-white/90 text-xl">Manage your No Objection Certificate requests seamlessly</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base font-bold backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {existingRequests.filter((r) => r.status === "approved").length} Approved
                </Badge>
                <Badge className="bg-cyber-yellow/20 text-white border-cyber-yellow/30 px-6 py-3 text-base font-bold backdrop-blur-sm">
                  <Clock className="w-5 h-5 mr-2" />
                  {existingRequests.filter((r) => r.status === "pending").length} Pending
                </Badge>
                <Badge className="bg-vibrant-pink/20 text-white border-vibrant-pink/30 px-6 py-3 text-base font-bold backdrop-blur-sm">
                  <Trophy className="w-5 h-5 mr-2" />
                  Fast Processing
                </Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => setShowNewRequestForm(!showNewRequestForm)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-8 py-4 text-lg font-bold rounded-2xl"
              >
                <Plus className="w-6 h-6 mr-3" />
                New NOC Request
              </Button>

              <div className="vibrant-card bg-white/20 backdrop-blur-sm p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">24-48 hrs</div>
                <div className="text-white/80 text-sm">Average Processing Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Request Form */}
      {showNewRequestForm && (
        <Card className="vibrant-card animate-slide-up border-0">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-electric-gradient rounded-2xl shadow-lg">
                <Plus className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Submit New NOC Request</h3>
                <p className="text-gray-600 font-medium">Fill out the form below to request a new NOC</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitRequest()
              }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Request Title</label>
                  <Input
                    placeholder="e.g., Summer Internship NOC - TechNova"
                    className="glass-morphism border-2 border-transparent focus:border-electric-blue focus:ring-4 focus:ring-blue-200 h-14 text-lg"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Company/Organization
                  </label>
                  <Input
                    placeholder="e.g., TechNova Solutions Pvt. Ltd."
                    className="glass-morphism border-2 border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-200 h-14 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Internship Type</label>
                  <Select required>
                    <SelectTrigger className="glass-morphism border-2 border-transparent focus:border-green-500 h-14 text-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism">
                      <SelectItem value="summer">Summer Internship</SelectItem>
                      <SelectItem value="winter">Winter Internship</SelectItem>
                      <SelectItem value="part-time">Part-time Internship</SelectItem>
                      <SelectItem value="full-time">Full-time Internship</SelectItem>
                      <SelectItem value="research">Research Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Duration</label>
                  <Select required>
                    <SelectTrigger className="glass-morphism border-2 border-transparent focus:border-orange-500 h-14 text-lg">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism">
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="2-months">2 Months</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Priority</label>
                  <Select required>
                    <SelectTrigger className="glass-morphism border-2 border-transparent focus:border-pink-500 h-14 text-lg">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism">
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Purpose & Description</label>
                <Textarea
                  placeholder="Describe the purpose of your internship, how it aligns with your academic goals, and any specific learning objectives..."
                  className="glass-morphism border-2 border-transparent focus:border-electric-blue focus:ring-4 focus:ring-blue-200 min-h-[120px] text-lg"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Upload Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-electric-blue transition-colors duration-300 glass-morphism">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    Drag and drop your files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Upload offer letter, company details, and any other relevant documents
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, JPG, PNG (Max 10MB each)</p>
                  <Button type="button" className="mt-4 btn-electric">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="flex gap-6 pt-8 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewRequestForm(false)}
                  className="flex-1 h-14 text-lg font-bold glass-morphism hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 btn-electric h-14 text-lg font-bold">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Existing Requests */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-royal-gradient rounded-2xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Your NOC Requests</h3>
            <p className="text-gray-600 font-medium">Track the status of your submitted requests</p>
          </div>
        </div>

        <div className="grid gap-8">
          {existingRequests.map((request, index) => (
            <Card
              key={request.id}
              className="vibrant-card hover-lift animate-slide-up border-0 relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Status Indicator Strip */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${getStatusGradient(request.status)}`}></div>

              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-6">
                      <div
                        className={`flex items-center justify-center w-16 h-16 ${getStatusGradient(request.status)} rounded-2xl shadow-xl`}
                      >
                        <Building2 className="h-8 w-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="text-2xl font-bold text-gray-900">{request.title}</h4>
                          <Badge className={`${getStatusColor(request.status)} text-sm px-4 py-2`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-2 capitalize font-bold">{request.status}</span>
                          </Badge>
                        </div>

                        <p className="text-gray-600 font-bold text-lg mb-4">{request.company}</p>

                        <div className="flex items-center gap-8 text-sm text-gray-500 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 icon-electric" />
                            <span className="font-medium">Requested: {request.requestDate}</span>
                          </div>
                          {request.status === "approved" && request.approvedDate && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 icon-green" />
                              <span className="font-medium">Approved: {request.approvedDate}</span>
                            </div>
                          )}
                          {request.status === "rejected" && request.rejectedDate && (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 icon-pink" />
                              <span className="font-medium">Rejected: {request.rejectedDate}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                          <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-gray-800 mb-2">Coordinator Remarks:</p>
                              <p className="text-gray-700 leading-relaxed">{request.remarks}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-morphism hover:bg-blue-50 bg-transparent border-2 border-blue-200"
                      >
                        <Eye className="h-4 w-4 mr-2 icon-electric" />
                        View Details
                      </Button>
                      {request.status === "approved" && (
                        <Button size="sm" className="btn-nature px-6">
                          <Download className="h-4 w-4 mr-2" />
                          Download NOC
                        </Button>
                      )}
                    </div>

                    <div className="vibrant-card p-4 text-center">
                      <p className="font-bold text-gray-800 text-sm mb-2">Documents ({request.documents.length})</p>
                      {request.documents.map((doc, idx) => (
                        <p key={idx} className="text-xs text-gray-600 truncate mb-1">
                          📄 {doc}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
