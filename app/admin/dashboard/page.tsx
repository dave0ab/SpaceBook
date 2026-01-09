"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBooking } from "@/lib/booking-context"
import { getSpaceById, getUserById } from "@/lib/mock-data"
import { Calendar, Users, ClipboardList, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function AdminDashboardPage() {
  const { bookings, users } = useBooking()

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const totalUsers = users.filter((u) => u.role === "user").length

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: "Pending Requests",
      value: pendingBookings.length,
      icon: Clock,
      color: "text-status-pending",
    },
    {
      label: "Approved",
      value: approvedBookings.length,
      icon: CheckCircle,
      color: "text-status-approved",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-chart-2",
    },
  ]

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
              <CardTitle>Recent Booking Requests</CardTitle>
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBookings.slice(0, 5).map((booking) => {
                  const space = getSpaceById(booking.spaceId)
                  const user = getUserById(booking.userId)
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{space?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.name} • {format(new Date(booking.date), "MMM d, yyyy")} • {booking.startTime} -{" "}
                            {booking.endTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-status-pending/20 text-status-pending">
                        Pending
                      </Badge>
                    </div>
                  )
                })}
                {pendingBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pending booking requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
