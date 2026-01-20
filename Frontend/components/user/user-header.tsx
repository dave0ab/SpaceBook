"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Bell, User, ChevronDown, Menu, X, LogOut, Settings, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/providers/auth-provider";
import {
  useNotifications,
  useUnreadNotificationCount,
} from "@/lib/hooks/use-notifications";
import { NotificationTray } from "@/components/admin/notification-tray";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function UserHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations();



  const navItems = [
    { href: "/user/dashboard", label: t("sidebar.dashboard") },
    { href: "/user/book", label: t("sidebar.book") },
    { href: "/user/calendar", label: t("calendar.calendar") },
    { href: "/user/applications", label: t("sidebar.myApplications") },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/user/dashboard" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-primary rounded-full transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-bold tracking-tight">{t("common.appName")}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="cursor-pointer"
              >
                <Inbox className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {showNotifications && (
                <NotificationTray
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="
                    group hidden sm:flex items-center gap-3
                    h-11
                    px-4
                    rounded-full
                    bg-secondary/20
                    backdrop-blur
                    border border-border/40
                    hover:bg-secondary/35
                    hover:border-primary/30
                    transition-all duration-200
                  "
                >
                  <div className="relative">
                    <div
                      className="
                        w-8 h-8
                        rounded-full
                        bg-gradient-to-br from-secondary to-muted
                        flex items-center justify-center
                        border border-border/60
                        group-hover:border-primary/40
                        transition-colors
                      "
                    >
                      <User className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <ChevronDown className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                </Button>
              </DropdownMenuTrigger>


              <DropdownMenuContent 
                align="end" 
                sideOffset={8}
                className="w-56 p-1.5 bg-popover/95 backdrop-blur-xl border-border/50 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-xl"
              >
                {/* User Header Section */}
                <div className="px-3 py-3 mb-1 bg-secondary/30 rounded-lg border border-border/40">
                  <p className="text-[13px] font-bold text-foreground tracking-tight leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 truncate opacity-70">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-md cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                    <User className="h-4 w-4 opacity-70" />
                    {t("topbar.profile")}
                    <DropdownMenuShortcut className="text-[10px] opacity-40 font-mono tracking-tighter">⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-md cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                    <Settings className="h-4 w-4 opacity-70" />
                    {t("topbar.settings")}
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-1.5 bg-border/40" />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-red-500/90 rounded-md cursor-pointer transition-colors focus:bg-red-500/10 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  {t("topbar.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-border mt-4 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
