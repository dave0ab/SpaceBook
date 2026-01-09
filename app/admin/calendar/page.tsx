"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/lib/booking-context"
import { getSpaceById } from "@/lib/mock-data"
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "week" | "month"

export default function AdminCalendarPage() {
  const { bookings } = useBooking()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("week")

  const approvedBookings = bookings.filter((b) => b.status === "approved")

  const getSpaceColor = (spaceId: string) => {
    const space = getSpaceById(spaceId)
    if (!space) return "bg-primary"
    switch (space.type) {
      case "auditorium":
        return "bg-auditorium"
      case "gym":
        return "bg-gym"
      case "soccer":
        return "bg-soccer"
      default:
        return "bg-primary"
    }
  }

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return approvedBookings.filter((b) => b.date === dateStr)
  }

  const navigatePrev = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const navigateNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendar View</CardTitle>
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-secondary rounded-lg p-1">
                  <Button
                    variant={viewMode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Month
                  </Button>
                </div>
                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={navigatePrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[150px] text-center">
                    {viewMode === "week"
                      ? `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`
                      : format(currentDate, "MMMM yyyy")}
                  </span>
                  <Button variant="outline" size="icon" onClick={navigateNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-auditorium" />
                  <span className="text-sm text-muted-foreground">Auditorium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gym" />
                  <span className="text-sm text-muted-foreground">Gym</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-soccer" />
                  <span className="text-sm text-muted-foreground">Soccer Fields</span>
                </div>
              </div>

              {viewMode === "week" ? (
                /* Week View */
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="min-h-[200px]">
                      <div
                        className={cn(
                          "text-center py-2 rounded-t-lg font-medium",
                          isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : "bg-secondary",
                        )}
                      >
                        <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                        <div className="text-lg">{format(day, "d")}</div>
                      </div>
                      <div className="border border-border rounded-b-lg p-2 space-y-1 min-h-[150px]">
                        {getBookingsForDate(day).map((booking) => {
                          const space = getSpaceById(booking.spaceId)
                          return (
                            <div
                              key={booking.id}
                              className={cn(
                                "px-2 py-1 rounded text-xs text-background font-medium",
                                getSpaceColor(booking.spaceId),
                              )}
                            >
                              <div className="truncate">{space?.name}</div>
                              <div className="opacity-80">{booking.startTime}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Month View */
                <div className="grid grid-cols-7 gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center py-2 font-medium text-muted-foreground text-sm">
                      {day}
                    </div>
                  ))}
                  {/* Padding for first week */}
                  {Array.from({ length: (monthStart.getDay() + 6) % 7 }, (_, i) => (
                    <div key={`pad-${i}`} className="min-h-[100px]" />
                  ))}
                  {monthDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[100px] border border-border rounded-lg p-2",
                        isSameDay(day, new Date()) && "border-primary",
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm font-medium mb-1",
                          isSameDay(day, new Date()) ? "text-primary" : "text-foreground",
                        )}
                      >
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {getBookingsForDate(day)
                          .slice(0, 2)
                          .map((booking) => {
                            const space = getSpaceById(booking.spaceId)
                            return (
                              <div
                                key={booking.id}
                                className={cn(
                                  "px-1 py-0.5 rounded text-xs text-background truncate",
                                  getSpaceColor(booking.spaceId),
                                )}
                              >
                                {space?.name.split(" ")[0]}
                              </div>
                            )
                          })}
                        {getBookingsForDate(day).length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{getBookingsForDate(day).length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
