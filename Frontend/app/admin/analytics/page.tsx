'use client';

"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminBookings } from "@/lib/hooks/use-admin"
import { useAdminUsers } from "@/lib/hooks/use-admin"
import { useSpaces } from "@/lib/hooks/use-spaces"
import { Loader2 } from "lucide-react"
import { useTranslations } from '@/lib/i18n'

export default function AdminAnalyticsPage() {
  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings()
  const { data: users = [], isLoading: usersLoading } = useAdminUsers()
  const { data: spaces = [], isLoading: spacesLoading } = useSpaces()
  const t = useTranslations()

  if (bookingsLoading || usersLoading || spacesLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminTopbar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </main>
        </div>
      </div>
    )
  }

  // Calculate bookings per space
  const bookingsPerSpace = spaces.map((space) => ({
    name: space.name,
    type: space.type,
    count: bookings.filter((b) => b.spaceId === space.id).length,
  }))

  // Calculate bookings by user
  const bookingsByUser = users
    .filter((u) => u.role === "user")
    .map((user) => ({
      name: user.name,
      count: bookings.filter((b) => b.user?.id === user.id || b.userId === user.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Status breakdown
  const statusBreakdown = {
    approved: bookings.filter((b) => b.status === "approved").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  }

  const totalBookings = bookings.length
  const maxSpaceCount = Math.max(...bookingsPerSpace.map((s) => s.count), 1)
  const maxUserCount = Math.max(...bookingsByUser.map((u) => u.count), 1)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings Per Space */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>{t('analytics.bookingsBySpace')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsPerSpace.map((space) => (
                    <div key={space.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{space.name}</span>
                        <span className="text-sm text-muted-foreground">{space.count}</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            space.type === "auditorium"
                              ? "bg-auditorium"
                              : space.type === "gym"
                                ? "bg-gym"
                                : "bg-soccer"
                          }`}
                          style={{ width: `${(space.count / maxSpaceCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bookings by User */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>{t('users.users')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsByUser.map((user, index) => (
                    <div key={user.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          <span className="text-muted-foreground mr-2">#{index + 1}</span>
                          {user.name}
                        </span>
                        <span className="text-sm text-muted-foreground">{user.count} {t('sidebar.bookings').toLowerCase()}</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
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
              <CardHeader>
                <CardTitle>{t('analytics.bookingsByStatus')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Pie Chart Representation */}
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {/* Approved */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="var(--status-approved)"
                        strokeWidth="20"
                        strokeDasharray={`${(statusBreakdown.approved / totalBookings) * 251.2} 251.2`}
                      />
                      {/* Pending */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="var(--status-pending)"
                        strokeWidth="20"
                        strokeDasharray={`${(statusBreakdown.pending / totalBookings) * 251.2} 251.2`}
                        strokeDashoffset={`-${(statusBreakdown.approved / totalBookings) * 251.2}`}
                      />
                      {/* Rejected */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="var(--status-rejected)"
                        strokeWidth="20"
                        strokeDasharray={`${(statusBreakdown.rejected / totalBookings) * 251.2} 251.2`}
                        strokeDashoffset={`-${((statusBreakdown.approved + statusBreakdown.pending) / totalBookings) * 251.2}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{totalBookings}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-status-approved" />
                        <span className="text-sm font-medium">{t('booking.approved')}</span>
                      </div>
                      <div className="text-3xl font-bold text-status-approved">{statusBreakdown.approved}</div>
                      <div className="text-sm text-muted-foreground">
                        {totalBookings > 0 ? Math.round((statusBreakdown.approved / totalBookings) * 100) : 0}%
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-status-pending" />
                        <span className="text-sm font-medium">{t('booking.pending')}</span>
                      </div>
                      <div className="text-3xl font-bold text-status-pending">{statusBreakdown.pending}</div>
                      <div className="text-sm text-muted-foreground">
                        {totalBookings > 0 ? Math.round((statusBreakdown.pending / totalBookings) * 100) : 0}%
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-status-rejected" />
                        <span className="text-sm font-medium">{t('booking.rejected')}</span>
                      </div>
                      <div className="text-3xl font-bold text-status-rejected">{statusBreakdown.rejected}</div>
                      <div className="text-sm text-muted-foreground">
                        {totalBookings > 0 ? Math.round((statusBreakdown.rejected / totalBookings) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
