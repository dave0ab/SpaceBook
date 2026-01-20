"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Providers } from "../providers"
import { ProtectedRoute } from "@/lib/components/protected-route"
import { MobileMenuProvider } from "@/lib/contexts/mobile-menu-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <Providers>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute requireAdmin>
          <MobileMenuProvider>
            {children}
          </MobileMenuProvider>
        </ProtectedRoute>
      )}
    </Providers>
  )
}
