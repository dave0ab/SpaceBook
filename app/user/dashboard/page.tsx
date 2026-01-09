"use client"

import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/lib/booking-context"
import { getSpaceById } from "@/lib/mock-data"
import { Clock, CheckCircle, XCircle, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function UserDashboardPage() {
  const { bookings, currentUser } = useBooking()

  const userBookings = currentUser ? bookings.filter((b) => b.userId === currentUser.id) : []

  const pendingBookings = userBookings.filter((b) => b.status === "pending")
  const approvedBookings = userBookings.filter((b) => b.status === "approved")
  const rejectedBookings = userBookings.filter((b) => b.status === "rejected")

  const stats = [
    {
      label: "Pending Approval",
      value: pendingBookings.length,
      icon: Clock,
      color: "text-status-pending",
      bgColor: "bg-status-pending/20",
    },
    {
      label: "Approved",
      value: approvedBookings.length,
      icon: CheckCircle,
      color: "text-status-approved",
      bgColor: "bg-status-approved/20",
    },
    {
      label: "Rejected",
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
            Pending
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

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your bookings and request new spaces</p>
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
              Book a Space
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Recent Bookings</CardTitle>
            <Link href="/user/applications">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {userBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">Start by booking your first space</p>
                <Link href="/user/book">
                  <Button>Book a Space</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.slice(0, 5).map((booking) => {
                  const space = getSpaceById(booking.spaceId)
                  return (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{space?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.date), "EEEE, MMMM d, yyyy")} • {booking.startTime} -{" "}
                            {booking.endTime}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
