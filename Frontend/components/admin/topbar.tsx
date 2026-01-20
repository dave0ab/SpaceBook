"use client"

import { useState } from "react"
import { Bell, ChevronDown, User, Menu } from "lucide-react"
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
import { useTranslations } from '@/lib/i18n'
import { LanguageSwitcher } from "@/components/language-switcher"
import { useMobileMenu } from "@/lib/contexts/mobile-menu-context"

export function AdminTopbar() {
  const { user: currentUser } = useAuth()
  const { data: notifications = [] } = useNotifications()
  const { data: unreadCount = 0 } = useUnreadNotificationCount()
  const [showNotifications, setShowNotifications] = useState(false)
  const { toggleMobileMenu } = useMobileMenu()
  const t = useTranslations()

  // Filter notifications for current admin user
  const adminNotifications = notifications.filter((n) => n.userId === currentUser?.id)

  return (
    <header className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="text-base md:text-lg font-semibold text-card-foreground">{t('dashboard.dashboard')}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Switcher - Hide on very small screens */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

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
            <Button variant="ghost" className="gap-1 md:gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden sm:inline font-medium">{currentUser?.name || "Admin"}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>{t('topbar.profile')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/">{t('topbar.logout')}</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
