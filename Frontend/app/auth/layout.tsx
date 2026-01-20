import type React from "react";
import { Providers } from "../providers";
import { ProtectedRoute } from "@/components/protected-route";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen bg-background">{children}</div>
      </ProtectedRoute>
    </Providers>
  );
}
