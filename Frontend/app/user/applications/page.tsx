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

export default function UserApplicationsPage() {
  const { user: currentUser } = useAuth()
  const { data: bookings = [], isLoading } = useBookings(undefined, currentUser?.id)
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all")

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
            Pending Approval
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-status-approved/20 text-status-approved border-0 gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-status-rejected/20 text-status-rejected border-0 gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
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
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">View and track all your booking requests</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingStatus | "all")}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-2">
              All <span className="text-muted-foreground">({counts.all})</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending <span className="text-muted-foreground">({counts.pending})</span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved <span className="text-muted-foreground">({counts.approved})</span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected <span className="text-muted-foreground">({counts.rejected})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBookings.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all" ? "You haven't made any booking requests yet" : `No ${activeTab} applications`}
                  </p>
                  <Button asChild>
                    <a href="/user/book">Book a Space</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredBookings.map((booking) => {
                  const space = booking.space
                  const bookingDate = typeof booking.date === 'string' ? booking.date : booking.date
                  return (
                    <Card key={booking.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-lg ${
                                booking.status === "pending"
                                  ? "bg-status-pending/20"
                                  : booking.status === "approved"
                                    ? "bg-status-approved/20"
                                    : "bg-status-rejected/20"
                              }`}
                            >
                              {getStatusIcon(booking.status)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{space?.name || 'Unknown Space'}</h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(bookingDate), "MMMM d, yyyy")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.startTime} - {booking.endTime}
                                </div>
                              </div>
                              {booking.notes && (
                                <p className="text-sm text-muted-foreground mt-2">Notes: {booking.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">{getStatusBadge(booking.status)}</div>
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
