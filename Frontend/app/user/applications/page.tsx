'use client';

"use client"

import { useState } from "react"
import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/providers/auth-provider"
import { useBookings } from "@/lib/hooks/use-bookings"
import { Loader2 } from "lucide-react"
import type { BookingStatus } from "@/lib/types"
import { format } from "date-fns"
import { Clock, CheckCircle, XCircle, Calendar, Building2 } from "lucide-react"
import { useTranslations } from '@/lib/i18n'

export default function UserApplicationsPage() {
  const { user: currentUser } = useAuth()
  const { data: bookings = [], isLoading } = useBookings(undefined, currentUser?.id)
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all")
  const t = useTranslations()

  const formatCreatedAt = (createdAt: unknown) => {
    try {
      if (!createdAt) return "-"
      const date = new Date(createdAt as any)
      if (Number.isNaN(date.getTime())) return "-"
      return format(date, "MMM d, yyyy HH:mm")
    } catch {
      return "-"
    }
  }

  const userBookings = bookings

  const filteredBookings = activeTab === "all" ? userBookings : userBookings.filter((b) => b.status === activeTab)

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: BookingStatus) => {
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

  const counts = {
    all: userBookings.length,
    pending: userBookings.filter((b) => b.status === "pending").length,
    approved: userBookings.filter((b) => b.status === "approved").length,
    rejected: userBookings.filter((b) => b.status === "rejected").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <UserHeader />
        <main className="container mx-auto px-4 md:px-6 py-4 md:py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 md:h-12 md:w-12 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('applications.myApplications')}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t('applications.applicationHistory')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingStatus | "all")}>
          <div className="overflow-x-auto mb-4 md:mb-6">
            <TabsList className="inline-flex min-w-full md:min-w-0">
              <TabsTrigger value="all" className="gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap">
                {t('filters.allStatus')} <span className="text-muted-foreground">({counts.all})</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap">
                {t('booking.pending')} <span className="text-muted-foreground">({counts.pending})</span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap">
                {t('booking.approved')} <span className="text-muted-foreground">({counts.approved})</span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap">
                {t('booking.rejected')} <span className="text-muted-foreground">({counts.rejected})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            {filteredBookings.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-8 md:py-12 text-center">
                  <Building2 className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2 text-sm md:text-base">{t('applications.noApplications')}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    {t('applications.startBooking')}
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <a href="/user/book">{t('booking.bookSpace')}</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:gap-4">
                {filteredBookings.map((booking) => {
                  const space = booking.space
                  const bookingDate = typeof booking.date === 'string' ? booking.date : booking.date
                  return (
                    <Card key={booking.id} className="bg-card border-border">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col gap-3 md:gap-4">
                          {/* Status Badge - Top on mobile, side on desktop */}
                          <div className="flex items-center justify-between md:hidden">
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="flex items-start gap-3 md:gap-4">
                            <div
                              className={`p-2 md:p-3 rounded-lg flex-shrink-0 ${
                                booking.status === "pending"
                                  ? "bg-status-pending/20"
                                  : booking.status === "approved"
                                    ? "bg-status-approved/20"
                                    : "bg-status-rejected/20"
                              }`}
                            >
                              {getStatusIcon(booking.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-base md:text-lg">{space?.name || 'Unknown Space'}</h3>
                                {/* Status Badge - Hidden on mobile, shown on desktop */}
                                <div className="hidden md:flex items-center">
                                  {getStatusBadge(booking.status)}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                  <span>{format(new Date(bookingDate), "MMMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                  <span>{booking.startTime} - {booking.endTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                  <span>{t('booking.requestCreatedAt')}: {formatCreatedAt((booking as any).createdAt)}</span>
                                </div>
                              </div>
                              {booking.notes && (
                                <div className="mt-2 p-2 md:p-3 bg-secondary/50 rounded-lg">
                                  <p className="text-xs md:text-sm text-muted-foreground">
                                    <span className="font-medium">{t('booking.notes')}:</span> {booking.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
