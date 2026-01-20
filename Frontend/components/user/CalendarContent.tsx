"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/providers/auth-provider"
import { useBookings, useBookingCounts } from "@/lib/hooks/use-bookings"
import { Loader2, CheckCircle, Clock, XCircle, Calendar, Building2, User as UserIcon } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/lib/types"
import { useTranslations } from '@/lib/i18n'
import { motion, AnimatePresence } from "framer-motion";
import { User, Booking } from "@/lib/types";

interface CalendarContentProps {
  initialUser?: User | null;
  initialCounts?: Record<string, number>;
  initialBookings?: Booking[];
}

export function CalendarContent({ initialUser, initialCounts = {}, initialBookings = [] }: CalendarContentProps = {}) {
  const { user: authUser } = useAuth()
  const user = authUser || initialUser;
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const t = useTranslations()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Fetch counts for visible month
  const startDateForCounts = format(monthStart, "yyyy-MM-dd")
  const endDateForCounts = format(monthEnd, "yyyy-MM-dd")
  const { data: countsByDate = initialCounts, isLoading: countsLoading } = useBookingCounts(
    startDateForCounts, 
    endDateForCounts, 
    user?.id
  )
  
  // Fetch bookings ONLY for selected date (current date on load)
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
  const { data: selectedDateBookingsData = [], isLoading: bookingsLoading } = useBookings(
    undefined, 
    user?.id, 
    selectedDateStr
  )
  
  const isInitialDate = selectedDate && isSameDay(selectedDate, new Date());
  const bookingsToDisplay = (isInitialDate && selectedDateBookingsData.length === 0) 
    ? initialBookings 
    : selectedDateBookingsData;

  // Filter selected date bookings
  const selectedDateBookings = bookingsToDisplay.filter(
    (b) => b.status === "approved" || b.status === "pending"
  )

  // Get booking count for a specific date from DB counts
  const getBookingCountForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd")
    return countsByDate[dateStr] || 0
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
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

  if (countsLoading && !countsByDate) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            SCHEDULE
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">{t('calendar.calendar')}</h1>
        <p className="text-lg text-muted-foreground font-light max-w-2xl">{t('booking.upcomingBookings')}</p>
      </motion.div>

      <div className="grid lg:grid-cols-7 gap-8">
        <motion.div 
          className="lg:col-span-4 xl:col-span-5"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border border-border/60 shadow-none overflow-hidden rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-6 bg-secondary/20 border-b border-border/40">
              <CardTitle className="font-serif text-2xl">{format(currentDate, "MMMM yyyy")}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-background border-border/60 hover:bg-secondary" onClick={() => {
                  setCurrentDate(subMonths(currentDate, 1))
                  setSelectedDate(null)
                }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full px-4 bg-background border-border/60 hover:bg-secondary" onClick={() => {
                  const today = new Date()
                  setCurrentDate(today)
                  setSelectedDate(today)
                }}>
                  {t('calendar.today')}
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-background border-border/60 hover:bg-secondary" onClick={() => {
                  setCurrentDate(addMonths(currentDate, 1))
                  setSelectedDate(null)
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Legend */}
              <div className="flex items-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">{t('booking.approved')}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">{t('booking.pending')}</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center font-medium text-muted-foreground text-xs uppercase tracking-widest pb-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
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
                    <motion.div
                      key={day.toISOString()}
                      layoutId={day.toISOString()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "min-h-[100px] rounded-xl p-3 cursor-pointer transition-all relative flex flex-col justify-between group border",
                        isBothTodayAndSelected 
                          ? "border-primary bg-primary/10 shadow-none z-10" 
                          : isToday 
                            ? "border-primary/40 border-dashed bg-secondary/50" 
                            : isSelected 
                              ? "border-primary bg-primary/5 shadow-none z-10" 
                              : "border-border/40 bg-card hover:bg-secondary/40 hover:border-primary/20",
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex justify-between items-start">
                         <span
                          className={cn(
                            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                            isToday ? "bg-primary text-primary-foreground" : "text-foreground group-hover:text-primary"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {bookingCount > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-red-500/10 text-red-600 border-0">
                                {bookingCount}
                            </Badge>
                        )}
                      </div>
                     
                      {bookingCount > 0 && (
                        <div className="mt-2">
                             <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md w-full justify-center">
                                <CheckCircle className="h-3 w-3" />
                                <span className="truncate">Booked</span>
                             </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Date Bookings Details */}
        <motion.div 
            className="lg:col-span-3 xl:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
          <div className="sticky top-28 space-y-6">
              <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border/60 shadow-xl shadow-black/5 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                <div className="p-6">
                    <h2 className="text-xl font-serif font-bold mb-1">
                        {selectedDate ? format(selectedDate, "MMMM d") : t('calendar.selectDate')}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        {selectedDate ? format(selectedDate, "EEEE, yyyy") : t('calendar.viewDetails')}
                    </p>

                    {!selectedDate ? (
                        <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/60">
                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">Select a date to view bookings</p>
                        </div>
                    ) : bookingsLoading ? (
                        <div className="flex justify-center py-12">
                             <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : selectedDateBookings.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/60">
                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">{t('calendar.noBookingsDate')}</p>
                             <Button variant="link" className="mt-2 text-primary" asChild>
                                <a href="/user/book">{t('booking.bookSpace')}</a>
                             </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                             {selectedDateBookings
                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                .map((booking, idx) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all hover:bg-secondary/20",
                                            getStatusColor(booking.status)
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-foreground line-clamp-1">{booking.space?.name || 'Unknown Space'}</h3>
                                            <div className={cn("p-1.5 rounded-full shrink-0", booking.status === 'approved' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600')}>
                                                {getStatusIcon(booking.status)}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                             <div className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{booking.startTime} - {booking.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-3.5 w-3.5" />
                                                <span className="capitalize">{booking.space?.type}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                             }
                        </div>
                    )}
                </div>
              </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
