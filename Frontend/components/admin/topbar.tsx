"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
  Menu,
  Search,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/providers/auth-provider";
import {
  useNotifications,
  useUnreadNotificationCount,
} from "@/lib/hooks/use-notifications";
import { NotificationTray } from "./notification-tray";
import { useTranslations } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useMobileMenu } from "@/lib/contexts/mobile-menu-context";
import { cn } from "@/lib/utils";

export function AdminTopbar() {
  const { user: currentUser, logout } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const [showNotifications, setShowNotifications] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();
  const t = useTranslations();

  const adminNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id,
  );

  return (
    <header className="h-14 sticky top-0 z-40 w-full bg-background/60 backdrop-blur-xl border-b border-border/50 px-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Minimalist Style */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="md:hidden h-8 w-8 rounded-lg hover:bg-secondary/80"
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb / Title Area */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
            <span className="hidden md:inline text-muted-foreground/30 font-normal">
              /
            </span>
            {t("dashboard.dashboard")}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Quick Search - Linear Aesthetic */}
        <div className="hidden lg:flex items-center mr-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 transition-all">
            <Search className="h-3.5 w-3.5" />
            <span className="text-[12px] font-medium mr-4">Search...</span>
            <kbd className="hidden sm:inline-flex h-4 items-center gap-1 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>
        </div>

        <LanguageSwitcher />

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "h-9 w-9 rounded-lg transition-all",
              showNotifications
                ? "bg-secondary text-primary"
                : "hover:bg-secondary/60",
            )}
          >
            <Bell className="h-[1.1rem] w-[1.1rem]" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background ring-offset-0 animate-pulse" />
            )}
          </Button>
          {showNotifications && (
            <NotificationTray
              notifications={adminNotifications}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group h-9 px-2 hover:bg-secondary/60 rounded-lg flex items-center gap-2 transition-all border border-transparent hover:border-border/40"
            >
              <div className="w-6.5 h-6.5 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="hidden sm:inline text-[13px] font-semibold text-foreground/90">
                {currentUser?.name || "Admin"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 p-1.5 bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl rounded-xl mt-2"
          >
            <div className="px-3 py-2 mb-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
                Admin Session
              </p>
              <p className="text-[13px] font-semibold truncate text-foreground">
                {currentUser?.email}
              </p>
            </div>
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-md cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
              <User className="h-4 w-4 opacity-70" />
              {t("topbar.profile")}
              <DropdownMenuShortcut className="text-[10px] opacity-40">
                ⇧⌘P
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-border/40" />

            <DropdownMenuItem
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-red-500/90 rounded-md cursor-pointer transition-colors focus:bg-red-500/10 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              {t("topbar.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
