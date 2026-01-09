"use client"

import type React from "react"

import { QueryProvider } from "@/lib/providers/query-provider"
import { AuthProvider } from "@/lib/providers/auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  )
}
