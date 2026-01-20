import type React from "react";
import { Providers } from "../providers";
import { UserHeader } from "@/components/user/user-header";
import { ProtectedRoute } from "@/lib/components/protected-route";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <UserHeader />
          {children}
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
