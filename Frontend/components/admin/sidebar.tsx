"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  BarChart3,
  Building2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useMobileMenu } from "@/lib/contexts/mobile-menu-context";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: t("sidebar.dashboard"),
      icon: LayoutDashboard,
    },
    { href: "/admin/calendar", label: t("sidebar.calendar"), icon: Calendar },
    {
      href: "/admin/bookings",
      label: t("sidebar.bookings"),
      icon: ClipboardList,
    },
    { href: "/admin/users", label: t("sidebar.users"), icon: Users },
    {
      href: "/admin/analytics",
      label: t("sidebar.analytics"),
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E] text-[#B1B1B3] font-sans">
      {/* Header / Workspace Switcher Style */}
      <div className="px-4 py-6">
        <Link
          href="/admin/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-white/5 transition-all duration-200 group"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-gradient-to-br from-white/10 to-transparent">
            <Building2 className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">
            {t("common.appName")}
          </span>
        </Link>
      </div>

      {/* Navigation - Calm & Spacious */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">
          Admin Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  : "hover:bg-white/5 hover:text-white/80",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-blue-400"
                    : "text-[#8A8A8E] group-hover:text-white/70",
                )}
              />
              <span className="flex-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute left-[-12px] h-4 w-[2px] bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Section */}
      <div className="p-3 mt-auto border-t border-white/5">
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#8A8A8E] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">{t("sidebar.logout")}</span>
        </Link>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();

  return (
    <>
      <aside className="hidden md:block w-60 border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-hidden bg-[#0C0C0E]">
        {/* Ambient Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <SidebarContent />
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0 border-r border-white/10 bg-[#0C0C0E]"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
