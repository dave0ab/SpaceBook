"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, ClipboardList, Users, BarChart3, Building2, LogOut } from "lucide-react"
import { useTranslations } from '@/lib/i18n'
import { useMobileMenu } from "@/lib/contexts/mobile-menu-context"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

// Sidebar content component (reusable for both desktop and mobile)
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const t = useTranslations()

  const navItems = [
    { href: "/admin/dashboard", label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { href: "/admin/calendar", label: t('sidebar.calendar'), icon: Calendar },
    { href: "/admin/bookings", label: t('sidebar.bookings'), icon: ClipboardList },
    { href: "/admin/users", label: t('sidebar.users'), icon: Users },
    { href: "/admin/analytics", label: t('sidebar.analytics'), icon: BarChart3 },
  ]

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin/dashboard" onClick={onLinkClick} className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-sidebar-foreground">{t('common.appName')}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">{t('sidebar.logout')}</span>
        </Link>
      </div>
    </>
  )
}

export function AdminSidebar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu()

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet Drawer) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            <SidebarContent onLinkClick={handleLinkClick} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
