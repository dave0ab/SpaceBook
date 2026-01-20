"use client"

import { format } from "date-fns"
import { X, Bell, CheckCircle, ClipboardList, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarkNotificationRead } from "@/lib/hooks/use-notifications"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NotificationTrayProps {
  notifications: Notification[]
  onClose: () => void
}

export function NotificationTray({ notifications, onClose }: NotificationTrayProps) {
  const markNotificationRead = useMarkNotificationRead()

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationRead.mutate(notification.id)
    }
  }

  const getIcon = (type: Notification["type"]) => {
    const iconClass = "h-3.5 w-3.5 transition-colors group-hover:text-foreground"
    switch (type) {
      case "booking_request":
        return <ClipboardList className={cn(iconClass, "text-blue-500")} />
      case "status_update":
        return <CheckCircle className={cn(iconClass, "text-emerald-500")} />
      default:
        return <Bell className={cn(iconClass, "text-muted-foreground")} />
    }
  }

  return (
    <div className="absolute right-0 top-full mt-3 w-96 bg-popover/95 backdrop-blur-xl border border-border shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Inbox</span>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            {notifications.filter(n => !n.read).length}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-border/60 transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-none">
        {notifications.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Inbox className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">All caught up</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "group relative px-5 py-4 border-b border-border/40 last:border-0 hover:bg-secondary/40 cursor-pointer transition-all duration-200",
                !notification.read && "bg-primary/[0.02]"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Unread Accent Line */}
              {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon Container */}
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-background border border-border/60 flex items-center justify-center shadow-sm group-hover:border-border transition-colors">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm tracking-tight transition-colors",
                      notification.read ? "text-muted-foreground font-normal" : "text-foreground font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap font-medium">
                      {format(new Date(notification.createdAt), "HH:mm")}
                    </span>
                  </div>
                  
                  <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">
                    {notification.message}
                  </p>

                  <div className="pt-1 flex items-center gap-2">
                    <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider font-bold">
                      {format(new Date(notification.createdAt), "MMM dd")}
                    </p>
                    {!notification.read && (
                       <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 bg-muted/20 border-t border-border/50">
          <button className="w-full py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  )
}