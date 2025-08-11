"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle2, Info, XCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  message: string
  timestamp: string
  read: boolean
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    message: "Your NOC request for Tech Solutions Inc. has been approved!",
    timestamp: "2024-07-28T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "info",
    message: "New internship opportunity posted: Data Analyst at Global Innovations.",
    timestamp: "2024-07-27T15:00:00Z",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    message: "Your weekly report for Week 3 needs revision. Check comments.",
    timestamp: "2024-07-26T09:00:00Z",
    read: true,
  },
  {
    id: "4",
    type: "error",
    message: "Your application for Creative Minds Agency was rejected. See details.",
    timestamp: "2024-07-25T11:45:00Z",
    read: true,
  },
  {
    id: "5",
    type: "success",
    message: "Certificate 'Web Dev Fundamentals' has been approved.",
    timestamp: "2024-07-24T14:00:00Z",
    read: true,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <Bell className="h-5 w-5 text-orange-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Mail className="h-5 w-5 text-muted-foreground" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    toast.success("Notification Marked as Read", {
      description: "The notification has been marked as read.",
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    toast.success("All Notifications Marked as Read", {
      description: "All unread notifications are now marked as read.",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    toast.info("Notification Deleted", {
      description: "The notification has been removed.",
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.
          </CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            Mark All as Read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No new notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  notif.read ? "bg-muted/50 text-muted-foreground" : "bg-background shadow-sm"
                }`}
              >
                <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                <div className="flex-grow">
                  <p className={`font-medium ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {!notif.read && (
                    <Button variant="ghost" size="icon" onClick={() => markAsRead(notif.id)}>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="sr-only">Mark as Read</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteNotification(notif.id)}>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="sr-only">Delete Notification</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
