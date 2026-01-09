"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBooking } from "@/lib/booking-context"
import { getSpaceById, getUserById, type BookingStatus } from "@/lib/mock-data"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

export default function AdminBookingsPage() {
  const { bookings, updateBookingStatus } = useBooking()

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-status-pending/20 text-status-pending border-0">Pending</Badge>
      case "approved":
        return <Badge className="bg-status-approved/20 text-status-approved border-0">Approved</Badge>
      case "rejected":
        return <Badge className="bg-status-rejected/20 text-status-rejected border-0">Rejected</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Space</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const space = getSpaceById(booking.spaceId)
                      const user = getUserById(booking.userId)
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                                {user?.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium">{space?.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{space?.type}</p>
                          </td>
                          <td className="py-4 px-4">{format(new Date(booking.date), "MMM d, yyyy")}</td>
                          <td className="py-4 px-4">
                            {booking.startTime} - {booking.endTime}
                          </td>
                          <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                          <td className="py-4 px-4">
                            {booking.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-status-approved text-status-approved hover:bg-status-approved hover:text-background bg-transparent"
                                  onClick={() => updateBookingStatus(booking.id, "approved")}
                                >
                                  <Check className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-status-rejected text-status-rejected hover:bg-status-rejected hover:text-foreground bg-transparent"
                                  onClick={() => updateBookingStatus(booking.id, "rejected")}
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
