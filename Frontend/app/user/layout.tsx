"use client"

import type React from "react"

import { Providers } from "../providers"
import { ProtectedRoute } from "@/lib/components/protected-route"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Providers>
  )
}
