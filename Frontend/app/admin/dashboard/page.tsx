import { fetchAdminBookings, fetchAdminUsers } from "@/lib/server-api";
import { getTranslations } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RecentBookings } from "@/components/admin/dashboard/recent-bookings";
import { ClipboardList, Clock, CheckCircle, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const [bookings, users, t] = await Promise.all([
    fetchAdminBookings().catch(() => []),
    fetchAdminUsers().catch(() => []),
    getTranslations(),
  ]);

  const pendingBookings = bookings.filter((b: any) => b.status === "pending");
  const approvedBookings = bookings.filter((b: any) => b.status === "approved");
  const totalUsers = users.filter((u: any) => u.role === "user").length;

  const stats = [
    {
      label: t("dashboard.totalBookings"),
      value: bookings.length,
      icon: "clipboard-list",
      color: "text-primary",
    },
    {
      label: t("dashboard.pendingRequests"),
      value: pendingBookings.length,
      icon: "clock",
      color: "text-status-pending",
    },
    {
      label: t("booking.approved"),
      value: approvedBookings.length,
      icon: "check-circle",
      color: "text-status-approved",
    },
    {
      label: t("dashboard.totalUsers"),
      value: totalUsers,
      icon: "users",
      color: "text-chart-2",
    },
  ];

  return (
    <main className="flex-1 p-4 md:p-6">
      <DashboardStats stats={stats} />
      <RecentBookings 
        bookings={bookings} 
        translations={{
          recentBookings: t("booking.recentBookings"),
          viewAll: t("booking.viewAll"),
          pending: t("booking.pending"),
          noBookings: t("booking.noBookings")
        }}
      />
    </main>
  );
}
