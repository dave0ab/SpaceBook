"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminBookings, useAdminUsers } from "@/lib/hooks/use-admin"
import { Calendar, Users, ClipboardList, CheckCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useTranslations } from 'next-intl'

export default function AdminDashboardPage() {
  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings()
  const { data: users = [], isLoading: usersLoading } = useAdminUsers()
  const t = useTranslations()

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const totalUsers = users.filter((u) => u.role === "user").length

  const stats = [
    {
      label: t('dashboard.totalBookings'),
      value: bookings.length,
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: t('dashboard.pendingRequests'),
      value: pendingBookings.length,
      icon: Clock,
      color: "text-status-pending",
    },
    {
      label: t('booking.approved'),
      value: approvedBookings.length,
      icon: CheckCircle,
      color: "text-status-approved",
    },
    {
      label: t('dashboard.totalUsers'),
      value: totalUsers,
      icon: Users,
      color: "text-chart-2",
    },
  ]

  if (bookingsLoading || usersLoading) {
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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Booking Requests */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('booking.recentBookings')}</CardTitle>
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm">
                  {t('booking.viewAll')}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.space?.name || 'Unknown Space'}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.user?.name || 'Unknown User'} • {format(new Date(booking.date), "MMM d, yyyy")} • {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-status-pending/20 text-status-pending">
                      {t('booking.pending')}
                    </Badge>
                  </div>
                ))}
                {pendingBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">{t('booking.noBookings')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
