"use client"

import { useState } from "react"
import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBooking } from "@/lib/booking-context"
import { getSpaceById } from "@/lib/mock-data"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UserCalendarPage() {
  const { bookings, currentUser } = useBooking()
  const [currentDate, setCurrentDate] = useState(new Date())

  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id && (b.status === "approved" || b.status === "pending"))
    : []

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return userBookings.filter((b) => b.date === dateStr)
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Calendar</h1>
          <p className="text-muted-foreground">View your approved and pending bookings</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-approved" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-pending" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center py-2 font-medium text-muted-foreground text-sm">
                  {day}
                </div>
              ))}
              {/* Padding for first week */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }, (_, i) => (
                <div key={`pad-${i}`} className="min-h-[120px]" />
              ))}
              {monthDays.map((day) => {
                const dayBookings = getBookingsForDate(day)
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[120px] border border-border rounded-lg p-2",
                      isSameDay(day, new Date()) && "border-primary bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium mb-2",
                        isSameDay(day, new Date()) ? "text-primary" : "text-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.map((booking) => {
                        const space = getSpaceById(booking.spaceId)
                        return (
                          <div
                            key={booking.id}
                            className={cn(
                              "px-2 py-1 rounded text-xs",
                              booking.status === "approved"
                                ? "bg-status-approved/20 text-status-approved"
                                : "bg-status-pending/20 text-status-pending",
                            )}
                          >
                            <div className="flex items-center gap-1">
                              {booking.status === "approved" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              <span className="truncate">{space?.name.split(" ")[0]}</span>
                            </div>
                            <div className="text-xs opacity-75">{booking.startTime}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings List */}
        <Card className="bg-card border-border mt-8">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {userBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No upcoming bookings</p>
            ) : (
              <div className="space-y-3">
                {userBookings
                  .filter((b) => new Date(b.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((booking) => {
                    const space = getSpaceById(booking.spaceId)
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-2 h-10 rounded-full",
                              booking.status === "approved" ? "bg-status-approved" : "bg-status-pending",
                            )}
                          />
                          <div>
                            <p className="font-medium">{space?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.date), "EEE, MMM d")} • {booking.startTime} - {booking.endTime}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "border-0",
                            booking.status === "approved"
                              ? "bg-status-approved/20 text-status-approved"
                              : "bg-status-pending/20 text-status-pending",
                          )}
                        >
                          {booking.status}
                        </Badge>
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
