"use client"

import type React from "react"

import { Providers } from "../providers"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
