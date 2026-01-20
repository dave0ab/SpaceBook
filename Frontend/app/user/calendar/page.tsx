'use client';

"use client"

import { useState, useEffect } from "react"
import { UserHeader } from "@/components/user/user-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/providers/auth-provider"
import { useBookings, useBookingCounts } from "@/lib/hooks/use-bookings"
import { Loader2, CheckCircle, Clock, XCircle, Calendar, Building2, User } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/lib/types"
import { useTranslations } from '@/lib/i18n'

export default function UserCalendarPage() {
  const { user: currentUser } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const t = useTranslations()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Fetch counts for visible month
  const startDateForCounts = format(monthStart, "yyyy-MM-dd")
  const endDateForCounts = format(monthEnd, "yyyy-MM-dd")
  const { data: countsByDate = {}, isLoading: countsLoading } = useBookingCounts(
    startDateForCounts, 
    endDateForCounts, 
    currentUser?.id
  )
  
  // Fetch bookings ONLY for selected date (current date on load)
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
  const { data: selectedDateBookingsData = [], isLoading: bookingsLoading } = useBookings(
    undefined, 
    currentUser?.id, 
    selectedDateStr
  )

  const isLoading = countsLoading || bookingsLoading
  
  // Filter selected date bookings
  const selectedDateBookings = selectedDateBookingsData.filter(
    (b) => b.status === "approved" || b.status === "pending"
  )

  // Get booking count for a specific date from DB counts
  const getBookingCountForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd")
    return countsByDate[dateStr] || 0
  }

  // Log to verify API is being called
  useEffect(() => {
    console.log('📅 [USER CALENDAR] Fetching counts for:', startDateForCounts, 'to', endDateForCounts)
    console.log('📅 [USER CALENDAR] Counts received:', countsByDate)
    console.log('📅 [USER CALENDAR] Selected date:', selectedDateStr)
    console.log('📅 [USER CALENDAR] Selected date bookings:', selectedDateBookings.length)
  }, [startDateForCounts, endDateForCounts, countsByDate, selectedDateStr, selectedDateBookings.length])

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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('calendar.calendar')}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t('booking.upcomingBookings')}</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 md:p-6 pb-4">
            <CardTitle className="text-base md:text-lg">{format(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="icon" onClick={() => {
                console.log('📅 Navigating to previous month')
                setCurrentDate(subMonths(currentDate, 1))
                setSelectedDate(null) // Clear selected date on navigation
              }}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => {
                console.log('📅 Navigating to today')
                const today = new Date()
                setCurrentDate(today)
                setSelectedDate(today)
                // Scroll to details section after a short delay
                setTimeout(() => {
                  const detailsSection = document.getElementById('selected-date-details')
                  if (detailsSection) {
                    detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }, 100)
              }} className="flex-1 sm:flex-none">
                {t('calendar.today')}
              </Button>
              <Button variant="outline" size="icon" onClick={() => {
                console.log('📅 Navigating to next month')
                setCurrentDate(addMonths(currentDate, 1))
                setSelectedDate(null) // Clear selected date on navigation
              }}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {/* Legend */}
            <div className="flex items-center gap-3 md:gap-6 mb-4 md:mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-status-approved" />
                <span className="text-xs md:text-sm text-muted-foreground">{t('booking.approved')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-status-pending" />
                <span className="text-xs md:text-sm text-muted-foreground">{t('booking.pending')}</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 md:gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center py-1 md:py-2 font-medium text-muted-foreground text-xs md:text-sm">
                  {day}
                </div>
              ))}
              {/* Padding for first week */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }, (_, i) => (
                <div key={`pad-${i}`} className="min-h-[60px] md:min-h-[120px]" />
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
                      "min-h-[60px] md:min-h-[120px] border rounded-lg p-1 md:p-2 cursor-pointer transition-colors relative",
                      isBothTodayAndSelected 
                        ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1" 
                        : isToday 
                          ? "border-blue-400 border-2 bg-card" 
                          : isSelected 
                            ? "border-primary bg-primary/10 border-2" 
                            : "border-border hover:border-primary/50",
                    )}
                    onClick={() => {
                      console.log('📅 Date clicked:', format(day, "yyyy-MM-dd"))
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
                    {/* Count Badge - Top Right Corner (RED, only show if count > 0) */}
                    {bookingCount > 0 && (
                      <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 z-10 rounded-full font-bold text-xs min-w-[18px] md:min-w-[24px] h-4 md:h-6 flex items-center justify-center px-1 md:px-2 shadow-lg bg-red-500 text-white">
                        {bookingCount}
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "text-xs md:text-sm font-medium mb-0.5 md:mb-2 flex items-center justify-between",
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
                    <div className="space-y-1 flex items-center justify-center min-h-[40px] md:min-h-[60px]">
                      {bookingCount > 0 ? (
                        <div className="text-center">
                          <div className="text-lg md:text-xl font-bold text-primary">{bookingCount}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">
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
          </CardContent>
        </Card>

        {/* Selected Date Bookings Details */}
        {selectedDate && (
          <Card id="selected-date-details" className="bg-card border-border mt-4 md:mt-8">
            <CardHeader className="p-4 md:p-6 pb-4">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-base md:text-lg">
                    {t('calendar.bookingsFor')} {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <Badge variant="secondary" className="self-start sm:ml-auto sm:self-auto">
                  {selectedDateBookings.length} {selectedDateBookings.length === 1 ? t('sidebar.bookings').toLowerCase().slice(0, -1) : t('sidebar.bookings').toLowerCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {selectedDateBookings.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-muted-foreground">
                  <Calendar className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm md:text-base">{t('calendar.noBookingsDate')}</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {selectedDateBookings
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((booking) => {
                      const space = booking.space
                      const bookingDate = typeof booking.date === 'string' ? booking.date : booking.date
                      return (
                        <Card key={booking.id} className={cn("border", getStatusColor(booking.status))}>
                          <CardContent className="p-3 md:p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                              <div className="flex items-start gap-3 md:gap-4 flex-1">
                                <div className={cn(
                                  "p-2 md:p-3 rounded-lg border flex-shrink-0",
                                  getStatusColor(booking.status)
                                )}>
                                  {getStatusIcon(booking.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <h3 className="font-semibold text-base md:text-lg">{space?.name || 'Unknown Space'}</h3>
                                    <Badge variant="outline" className="capitalize text-xs">
                                      {space?.type}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                      <span>{booking.startTime} - {booking.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                      <span>{format(new Date(bookingDate), "MMMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{t('spaces.capacity')}:</span>
                                      <span>{space?.capacity || 'N/A'} {t('spaces.people')}</span>
                                    </div>
                                  </div>
                                  {booking.notes && (
                                    <div className="mt-2 md:mt-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                                      <p className="text-xs md:text-sm font-medium mb-1">{t('booking.notes')}:</p>
                                      <p className="text-xs md:text-sm text-muted-foreground">{booking.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 flex-shrink-0">
                                <Badge className={cn(
                                  "border text-xs",
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
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                  Requested: {formatCreatedAt((booking as any).createdAt)}
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
  )
}
