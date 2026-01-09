"use client"

import { useState } from "react"
import { Bell, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/providers/auth-provider"
import { useNotifications, useUnreadNotificationCount } from "@/lib/hooks/use-notifications"
import { NotificationTray } from "./notification-tray"

export function AdminTopbar() {
  const { user: currentUser } = useAuth()
  const { data: notifications = [] } = useNotifications()
  const { data: unreadCount = 0 } = useUnreadNotificationCount()
  const [showNotifications, setShowNotifications] = useState(false)

  // Filter notifications for current admin user
  const adminNotifications = notifications.filter((n) => n.userId === currentUser?.id)

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold text-card-foreground">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          {showNotifications && (
            <NotificationTray notifications={adminNotifications} onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{currentUser?.name || "Admin"}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
