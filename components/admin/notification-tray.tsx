"use client"

import { format } from "date-fns"
import { X, Bell, CheckCircle, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/lib/booking-context"
import type { Notification } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface NotificationTrayProps {
  notifications: Notification[]
  onClose: () => void
}

export function NotificationTray({ notifications, onClose }: NotificationTrayProps) {
  const { markNotificationRead } = useBooking()

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking_request":
        return <ClipboardList className="h-4 w-4 text-primary" />
      case "status_update":
        return <CheckCircle className="h-4 w-4 text-status-approved" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                !notification.read && "bg-primary/5",
              )}
              onClick={() => markNotificationRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
                {!notification.read && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
