"use client"

import type React from "react"

import { BookingProvider } from "@/lib/booking-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}
