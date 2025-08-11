"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Bell, CheckCircle, AlertCircle, Info, FileText, Building2, Clock } from "lucide-react"

interface Notification {
  id: string
  type: "application_update" | "noc_update" | "deadline" | "general"
  title: string
  message: string
  read: boolean
  created_at: string
  priority: "low" | "medium" | "high"
  related_id?: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Since we don't have a notifications table, we'll generate notifications
      // based on recent activities and status changes
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "application_update",
          title: "Application Approved",
          message:
            "Your application for Software Developer Intern at TechCorp Solutions has been approved by the teacher. It's now pending T&P Officer approval.",
          read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          priority: "high",
          related_id: "app_1",
        },
        {
          id: "2",
          type: "noc_update",
          title: "NOC Request Under Review",
          message:
            "Your NOC request for Data Science Intern position is currently under teacher review. You'll be notified once a decision is made.",
          read: false,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          priority: "medium",
          related_id: "noc_1",
        },
        {
          id: "3",
          type: "deadline",
          title: "Weekly Report Due Tomorrow",
          message:
            "Your Week 3 weekly report for the internship at InnovateLabs is due tomorrow. Please submit it on time to maintain your progress record.",
          read: false,
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          priority: "high",
          related_id: "report_3",
        },
        {
          id: "4",
          type: "general",
          title: "New Internship Opportunities",
          message:
            "5 new internship opportunities have been posted. Check them out in the Opportunities section to find positions that match your interests.",
          read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          priority: "low",
        },
        {
          id: "5",
          type: "application_update",
          title: "Application Status Update",
          message:
            "Your application for Frontend Developer Intern at WebTech Corp has been forwarded to the T&P Officer for final approval.",
          read: true,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          priority: "medium",
          related_id: "app_2",
        },
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case "application_update":
        return <FileText className={`h-4 w-4 ${priority === "high" ? "text-green-600" : "text-blue-600"}`} />
      case "noc_update":
        return <Building2 className={`h-4 w-4 ${priority === "high" ? "text-green-600" : "text-blue-600"}`} />
      case "deadline":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "general":
        return <Info className="h-4 w-4 text-gray-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your internship activities</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({notifications.length})
            </Button>
            <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getNotificationIcon(notification.type, notification.priority)}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      {notification.title}
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                        {notification.priority.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeAgo(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "You're all caught up! Check back later for new updates."
                : "You'll receive notifications about your applications, NOC requests, and important updates here."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
