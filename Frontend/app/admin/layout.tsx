import type React from "react";
import { Providers } from "../providers";
import { ProtectedRoute } from "@/components/protected-route";
import { MobileMenuProvider } from "@/lib/contexts/mobile-menu-context";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ProtectedRoute requireAdmin>
        <MobileMenuProvider>
          <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
              <AdminTopbar />
              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </MobileMenuProvider>
      </ProtectedRoute>
    </Providers>
  );
}
