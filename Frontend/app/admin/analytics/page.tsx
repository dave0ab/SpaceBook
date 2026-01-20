'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminBookings, useAdminUsers } from "@/lib/hooks/use-admin";
import { useSpaces } from "@/lib/hooks/use-spaces";
import { useTranslations } from "@/lib/i18n";
import { StatusBreakdownChart } from "@/components/admin/analytics/status-breakdown-chart";
import { Loader2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: spaces = [], isLoading: spacesLoading } = useSpaces();
  const t = useTranslations();

  if (bookingsLoading || usersLoading || spacesLoading) {
    return (
      <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  // Calculate bookings per space
  const bookingsPerSpace = spaces.map((space) => ({
    name: space.name,
    type: space.type,
    count: bookings.filter((b) => b.spaceId === space.id).length,
  }));

  // Calculate bookings by user
  const bookingsByUser = users
    .filter((u) => u.role === "user")
    .map((user) => ({
      name: user.name,
      count: bookings.filter(
        (b) => b.user?.id === user.id || b.userId === user.id,
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Status breakdown
  const statusBreakdown = {
    approved: bookings.filter((b) => b.status === "approved").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  const totalBookings = bookings.length;
  const maxSpaceCount = Math.max(...bookingsPerSpace.map((s) => s.count), 1);
  const maxUserCount = Math.max(...bookingsByUser.map((u) => u.count), 1);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bookings Per Space */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 md:p-6 pb-4">
            <CardTitle className="text-base md:text-lg">
              {t("analytics.bookingsBySpace")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {bookingsPerSpace.map((space) => (
                <div key={space.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium">
                      {space.name}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {space.count}
                    </span>
                  </div>
                  <div className="h-2.5 md:h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        space.type === "auditorium"
                          ? "bg-auditorium"
                          : space.type === "gym"
                            ? "bg-gym"
                            : "bg-soccer"
                      }`}
                      style={{
                        width: `${(space.count / maxSpaceCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookings by User */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 md:p-6 pb-4">
            <CardTitle className="text-base md:text-lg">
              {t("users.users")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {bookingsByUser.map((user, index) => (
                <div key={user.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium">
                      <span className="text-muted-foreground mr-2">
                        #{index + 1}
                      </span>
                      {user.name}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {user.count} {t("sidebar.bookings").toLowerCase()}
                    </span>
                  </div>
                  <div className="h-2.5 md:h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-2 rounded-full transition-all"
                      style={{ width: `${(user.count / maxUserCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="p-4 md:p-6 pb-4">
            <CardTitle className="text-base md:text-lg">
              {t("analytics.bookingsByStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <StatusBreakdownChart 
              statusBreakdown={statusBreakdown} 
              totalBookings={totalBookings} 
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
