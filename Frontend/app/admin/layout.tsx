"use client";

import type React from "react";
import { Providers } from "../providers";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/lib/components/protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

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
  );
}
