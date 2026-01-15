"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminBookings, useAdminBookingCounts } from "@/lib/hooks/use-admin"
import { useSpaces } from "@/lib/hooks/use-spaces"
import { Loader2, CheckCircle, Clock, XCircle, Calendar, User, Building2 } from "lucide-react"
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
import type { BookingStatus } from "@/lib/types"
import { useTranslations } from 'next-intl'

type ViewMode = "week" | "month"

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const t = useTranslations()
  
  // Calculate date range for visible calendar
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const startDateForCounts = viewMode === "week" 
    ? format(weekDays[0], "yyyy-MM-dd")
    : format(monthStart, "yyyy-MM-dd")
  const endDateForCounts = viewMode === "week"
    ? format(weekDays[6], "yyyy-MM-dd")
    : format(monthEnd, "yyyy-MM-dd")
  
  // Fetch counts for visible dates only
  const { data: countsByDate = {}, isLoading: countsLoading } = useAdminBookingCounts(startDateForCounts, endDateForCounts)
  
  // Fetch bookings ONLY for selected date (current date on load)
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
  const { data: selectedDateBookings = [], isLoading: bookingsLoading } = useAdminBookings(undefined, selectedDateStr)
  
  const { data: spaces = [], isLoading: spacesLoading } = useSpaces()
  
  const isLoading = countsLoading || bookingsLoading || spacesLoading

  if (isLoading) {
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

  const getSpaceColor = (spaceType?: string) => {
    switch (spaceType) {
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

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return "bg-status-approved/20 text-status-approved border-status-approved/30"
      case "pending":
        return "bg-status-pending/20 text-status-pending border-status-pending/30"
      case "rejected":
        return "bg-status-rejected/20 text-status-rejected border-status-rejected/30"
    }
  }

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
    }
  }

  // Get booking count for a specific date from DB counts
  const getBookingCountForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd")
    return countsByDate[dateStr] || 0
  }

  const navigatePrev = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
    setSelectedDate(null) // Clear selected date on navigation
  }

  const navigateNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
    setSelectedDate(null) // Clear selected date on navigation
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('calendar.calendar')}</CardTitle>
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-secondary rounded-lg p-1">
                  <Button
                    variant={viewMode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    {t('calendar.week')}
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    {t('calendar.month')}
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
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-auditorium" />
                  <span className="text-sm text-muted-foreground">{t('spaces.auditorium')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gym" />
                  <span className="text-sm text-muted-foreground">{t('spaces.gym')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-soccer" />
                  <span className="text-sm text-muted-foreground">{t('spaces.soccer')}</span>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-status-approved" />
                    <span className="text-sm text-muted-foreground">{t('booking.approved')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-status-pending" />
                    <span className="text-sm text-muted-foreground">{t('booking.pending')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-status-rejected" />
                    <span className="text-sm text-muted-foreground">{t('booking.rejected')}</span>
                  </div>
                </div>
              </div>

              {viewMode === "week" ? (
                /* Week View */
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const bookingCount = getBookingCountForDate(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isToday = isSameDay(day, new Date())
                    const isBothTodayAndSelected = isToday && isSelected
                    
                    return (
                      <div 
                        key={day.toISOString()} 
                        className="min-h-[200px] cursor-pointer relative"
                        onClick={() => {
                          setSelectedDate(day)
                          // Scroll to details section after a short delay
                          setTimeout(() => {
                            const detailsSection = document.getElementById('selected-date-details')
                            if (detailsSection) {
                              detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                          }, 100)
                        }}
                      >
                        {/* Count Badge - Top Right Corner */}
                        {bookingCount > 0 && (
                          <div className={cn(
                            "absolute top-1 right-1 z-10 rounded-full font-bold text-xs min-w-[24px] h-6 flex items-center justify-center px-2 shadow-md",
"bg-red-500 text-white"
                          )}>
                            {bookingCount}
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "text-center py-2 rounded-t-lg font-medium relative",
                            isBothTodayAndSelected 
                              ? "bg-red-500 text-white ring-2 ring-primary ring-offset-2" 
                              : isToday 
                                ? "bg-secondary text-white border-2 border-blue-400" 
                                : isSelected 
                                  ? "bg-primary/20 text-primary border-2 border-primary" 
                                  : "bg-secondary",
                          )}
                        >
                          <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                          <div className="text-lg">
                            {format(day, "d")}
                          </div>
                        </div>
                        <div className={cn(
                          "border rounded-b-lg p-2 space-y-1 min-h-[150px] flex items-center justify-center",
                          isBothTodayAndSelected 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : isToday 
                              ? "border-blue-400 border-2 bg-card" 
                              : isSelected 
                                ? "border-primary bg-primary/10 border-2" 
                                : "border-border"
                        )}>
                          {bookingCount > 0 ? (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{bookingCount}</div>
                              <div className="text-xs text-muted-foreground">
                                {bookingCount === 1 ? t('sidebar.bookings').toLowerCase().slice(0, -1) : t('sidebar.bookings').toLowerCase()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">{t('calendar.noBookingsDate')}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
                  {monthDays.map((day) => {
                    const bookingCount = getBookingCountForDate(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isToday = isSameDay(day, new Date())
                    const isBothTodayAndSelected = isToday && isSelected
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "min-h-[100px] border rounded-lg p-2 cursor-pointer transition-colors relative",
                          isBothTodayAndSelected 
                            ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1" 
                            : isToday 
                              ? "border-blue-400 border-2 bg-card" 
                              : isSelected 
                                ? "border-primary bg-primary/10 border-2" 
                                : "border-border hover:border-primary/50",
                        )}
                        onClick={() => {
                          setSelectedDate(day)
                          // Scroll to details section after a short delay
                          setTimeout(() => {
                            const detailsSection = document.getElementById('selected-date-details')
                            if (detailsSection) {
                              detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                          }, 100)
                        }}
                      >
                        {/* Count Badge - Top Right Corner */}
                        {bookingCount > 0 && (
                          <div className={cn(
                            "absolute top-1 right-1 z-10 rounded-full font-bold text-xs min-w-[24px] h-6 flex items-center justify-center px-2 shadow-md",
"bg-red-500 text-white"
                          )}>
                            {bookingCount}
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "text-sm font-medium mb-1 flex items-center justify-between",
                            isBothTodayAndSelected 
                              ? "text-primary font-bold" 
                              : isToday 
                                ? "text-white font-semibold" 
                                : isSelected 
                                  ? "text-primary" 
                                  : "text-foreground",
                          )}
                        >
                          <span>{format(day, "d")}</span>
                        </div>
                        <div className="space-y-1 flex items-center justify-center min-h-[60px]">
                          {bookingCount > 0 ? (
                            <div className="text-center">
                              <div className="text-xl font-bold text-primary">{bookingCount}</div>
                              <div className="text-xs text-muted-foreground">
                                {bookingCount === 1 ? t('sidebar.bookings').toLowerCase().slice(0, -1) : t('sidebar.bookings').toLowerCase()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground opacity-50">-</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Date Bookings Details */}
          {selectedDate && (
            <Card id="selected-date-details" className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('calendar.bookingsFor')} {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  <Badge variant="secondary" className="ml-auto">
                    {selectedDateBookings.length} {selectedDateBookings.length === 1 ? t('sidebar.bookings').toLowerCase().slice(0, -1) : t('sidebar.bookings').toLowerCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('calendar.noBookingsDate')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateBookings
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((booking) => {
                        const space = booking.space
                        const user = booking.user
                        return (
                          <Card key={booking.id} className={cn("border", getStatusColor(booking.status))}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className={cn(
                                    "p-3 rounded-lg border",
                                    getStatusColor(booking.status)
                                  )}>
                                    {getStatusIcon(booking.status)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Building2 className="h-4 w-4 text-muted-foreground" />
                                      <h3 className="font-semibold text-lg">{space?.name || 'Unknown Space'}</h3>
                                      <Badge variant="outline" className="capitalize">
                                        {space?.type}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{user?.name || 'Unknown User'}</span>
                                        <span className="text-xs">({user?.email || 'N/A'})</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{booking.startTime} - {booking.endTime}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{t('spaces.capacity')}:</span>
                                        <span>{space?.capacity || 'N/A'} {t('spaces.people')}</span>
                                      </div>
                                    </div>
                                    {booking.notes && (
                                      <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                                        <p className="text-sm font-medium mb-1">{t('booking.notes')}:</p>
                                        <p className="text-sm text-muted-foreground">{booking.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge className={cn(
                                    "border",
                                    booking.status === "approved" ? "bg-status-approved/20 text-status-approved border-status-approved/30" :
                                    booking.status === "pending" ? "bg-status-pending/20 text-status-pending border-status-pending/30" :
                                    "bg-status-rejected/20 text-status-rejected border-status-rejected/30"
                                  )}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(booking.status)}
                                      <span className="capitalize">
                                        {booking.status === 'approved' ? t('booking.approved') : 
                                         booking.status === 'pending' ? t('booking.pending') : 
                                         t('booking.rejected')}
                                      </span>
                                    </div>
                                  </Badge>
                                  <div className="text-xs text-muted-foreground">
                                    {format(new Date(booking.createdAt), "MMM d, yyyy")}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
