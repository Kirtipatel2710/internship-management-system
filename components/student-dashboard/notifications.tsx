"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Mail,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  type: "approval" | "rejection" | "reminder" | "system"
  title: string
  message: string
  read: boolean
  created_at: string
  related_id?: string
  related_type?: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // For now, we'll use mock data since we don't have a notifications table
    // In a real implementation, you would fetch from a notifications table
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "approval",
          title: "NOC Request Approved",
          message: "Your NOC request for TechCorp Solutions has been approved by the T&P Officer.",
          read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          related_id: "noc_1",
          related_type: "noc_request",
        },
        {
          id: "2",
          type: "reminder",
          title: "Weekly Report Due",
          message: "Your weekly report #9 is due tomorrow. Please submit it before the deadline.",
          read: false,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        },
        {
          id: "3",
          type: "approval",
          title: "Certificate Approved",
          message: "Your internship completion certificate has been verified and approved.",
          read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          related_id: "cert_1",
          related_type: "certificate",
        },
        {
          id: "4",
          type: "system",
          title: "Profile Update Required",
          message: "Please update your profile with your current semester and CGPA information.",
          read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        {
          id: "5",
          type: "rejection",
          title: "Weekly Report Needs Revision",
          message: "Your weekly report #7 needs revision. Please check the comments and resubmit.",
          read: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          related_id: "report_7",
          related_type: "weekly_report",
        },
      ]

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
    toast({
      title: "Success",
      description: "All notifications marked as read",
    })
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    toast({
      title: "Success",
      description: "Notification deleted",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejection":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "reminder":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case "system":
        return <Settings className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "approval":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejection":
        return <Badge variant="destructive">Action Required</Badge>
      case "reminder":
        return <Badge className="bg-orange-100 text-orange-800">Reminder</Badge>
      case "system":
        return <Badge className="bg-blue-100 text-blue-800">System</Badge>
      default:
        return <Badge variant="outline">Info</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-8 w-8 text-blue-600" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <MarkAsUnread className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Approvals</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter((n) => n.type === "approval").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Action Required</p>
                <p className="text-2xl font-bold text-red-600">
                  {notifications.filter((n) => n.type === "rejection" || n.type === "reminder").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-all cursor-pointer ${
                !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getNotificationBadge(notification.type)}
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>

                    <p className={`text-sm mb-3 ${!notification.read ? "text-gray-800" : "text-gray-600"}`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(notification.created_at)}</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
