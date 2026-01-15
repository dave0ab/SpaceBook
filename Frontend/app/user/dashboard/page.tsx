'use client';

"use client"

import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/providers/auth-provider"
import { useBookings } from "@/lib/hooks/use-bookings"
import { Clock, CheckCircle, XCircle, Calendar, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useTranslations } from '@/lib/i18n'

export default function UserDashboardPage() {
  const { user } = useAuth()
  const { data: bookings = [], isLoading } = useBookings(undefined, user?.id)
  const t = useTranslations()

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const rejectedBookings = bookings.filter((b) => b.status === "rejected")

  const stats = [
    {
      label: t('booking.pending'),
      value: pendingBookings.length,
      icon: Clock,
      color: "text-status-pending",
      bgColor: "bg-status-pending/20",
    },
    {
      label: t('booking.approved'),
      value: approvedBookings.length,
      icon: CheckCircle,
      color: "text-status-approved",
      bgColor: "bg-status-approved/20",
    },
    {
      label: t('booking.rejected'),
      value: rejectedBookings.length,
      icon: XCircle,
      color: "text-status-rejected",
      bgColor: "bg-status-rejected/20",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-status-pending/20 text-status-pending border-0 gap-1">
            <Clock className="h-3 w-3" />
            {t('booking.pending')}
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-status-approved/20 text-status-approved border-0 gap-1">
            <CheckCircle className="h-3 w-3" />
            {t('booking.approved')}
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-status-rejected/20 text-status-rejected border-0 gap-1">
            <XCircle className="h-3 w-3" />
            {t('booking.rejected')}
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.welcomeBack')}, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">{t('dashboard.hereIsOverview')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link href="/user/book">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              {t('booking.bookSpace')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('booking.recentBookings')}</CardTitle>
            <Link href="/user/applications">
              <Button variant="outline" size="sm">
                {t('booking.viewAll')}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">{t('booking.noBookings')}</h3>
                <p className="text-muted-foreground mb-4">{t('applications.startBooking')}</p>
                <Link href="/user/book">
                  <Button>{t('booking.bookSpace')}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.space?.name || 'Unknown Space'}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(typeof booking.date === 'string' ? booking.date : booking.date), "EEEE, MMMM d, yyyy")} • {booking.startTime} -{" "}
                          {booking.endTime}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
