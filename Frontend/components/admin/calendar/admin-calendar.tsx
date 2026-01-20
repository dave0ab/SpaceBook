"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminBookings, useAdminBookingCounts } from "@/lib/hooks/use-admin";
import { useSpaces } from "@/lib/hooks/use-spaces";
import {
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
} from "date-fns";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

type ViewMode = "week" | "month";

interface AdminCalendarProps {
  initialSpaces?: any[];
}

export function AdminCalendar({ initialSpaces }: AdminCalendarProps = {}) {
  const { data: spaces = initialSpaces || [] } = useSpaces();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const t = useTranslations();

  // Calculate date range for visible calendar
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDateForCounts =
    viewMode === "week"
      ? format(weekDays[0], "yyyy-MM-dd")
      : format(monthStart, "yyyy-MM-dd");
  const endDateForCounts =
    viewMode === "week"
      ? format(weekDays[6], "yyyy-MM-dd")
      : format(monthEnd, "yyyy-MM-dd");

  const { data: countsByDate = {}, isLoading: countsLoading } =
    useAdminBookingCounts(startDateForCounts, endDateForCounts);

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;
  const { data: selectedDateBookings = [], isLoading: bookingsLoading } =
    useAdminBookings(undefined, selectedDateStr);

  const isLoading = countsLoading || bookingsLoading;

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return "bg-status-approved/20 text-status-approved border-status-approved/30";
      case "pending":
        return "bg-status-pending/20 text-status-pending border-status-pending/30";
      case "rejected":
        return "bg-status-rejected/20 text-status-rejected border-status-rejected/30";
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getBookingCountForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd");
    return (countsByDate as any)[dateStr] || 0;
  };

  const navigatePrev = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
    setSelectedDate(null);
  };

  const navigateNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-6 pb-4">
          <CardTitle className="text-lg">{t("calendar.calendar")}</CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                {t("calendar.week")}
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                {t("calendar.month")}
              </Button>
            </div>
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
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-auditorium" /><span className="text-sm text-muted-foreground">{t("spaces.auditorium")}</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gym" /><span className="text-sm text-muted-foreground">{t("spaces.gym")}</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-soccer" /><span className="text-sm text-muted-foreground">{t("spaces.soccer")}</span></div>
            <div className="flex items-center gap-4 ml-auto flex-wrap">
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-status-approved" /><span className="text-sm text-muted-foreground">{t("booking.approved")}</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-status-pending" /><span className="text-sm text-muted-foreground">{t("booking.pending")}</span></div>
              <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-status-rejected" /><span className="text-sm text-muted-foreground">{t("booking.rejected")}</span></div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : viewMode === "week" ? (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const count = getBookingCountForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                return (
                  <div key={day.toISOString()} className="min-h-[200px] cursor-pointer relative" onClick={() => setSelectedDate(day)}>
                    {count > 0 && <div className="absolute top-1 right-1 z-10 rounded-full font-bold text-xs min-w-[24px] h-6 flex items-center justify-center px-2 shadow-md bg-red-500 text-white">{count}</div>}
                    <div className={cn("text-center py-2 rounded-t-lg font-medium", isToday && isSelected ? "bg-red-500 text-white shadow-lg" : isToday ? "bg-secondary text-white border-2 border-primary" : isSelected ? "bg-primary/20 text-primary border-2 border-primary" : "bg-secondary")}>
                      <div className="text-xs opacity-80">{format(day, "EEE")}</div>
                      <div className="text-lg">{format(day, "d")}</div>
                    </div>
                    <div className={cn("border rounded-b-lg p-2 min-h-[150px] flex items-center justify-center", isSelected ? "border-primary bg-primary/5" : "border-border")}>
                      {count > 0 ? (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{count}</div>
                          <div className="text-xs text-muted-foreground">{t("sidebar.bookings").toLowerCase()}</div>
                        </div>
                      ) : <div className="text-xs text-muted-foreground">{t("calendar.noBookingsDate")}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="text-center py-2 font-medium text-muted-foreground text-sm">{d}</div>)}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => <div key={i} />)}
              {monthDays.map(day => {
                const count = getBookingCountForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                return (
                  <div key={day.toISOString()} className={cn("min-h-[100px] border rounded-lg p-2 cursor-pointer transition-colors relative", isToday && isSelected ? "bg-primary/10 border-primary ring-2 ring-primary" : isToday ? "border-primary border-2" : isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")} onClick={() => setSelectedDate(day)}>
                    {count > 0 && <div className="absolute top-1 right-1 z-10 rounded-full font-bold text-xs min-w-[24px] h-6 flex items-center justify-center px-2 shadow-md bg-red-500 text-white">{count}</div>}
                    <div className={cn("text-sm font-medium", isToday ? "text-primary font-bold" : "")}>{format(day, "d")}</div>
                    <div className="flex items-center justify-center min-h-[60px]">
                      {count > 0 ? (
                        <div className="text-center">
                          <div className="text-xl font-bold text-primary">{count}</div>
                        </div>
                      ) : <div className="text-xs text-muted-foreground opacity-30">-</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="bg-card border-border">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /><span>{t("calendar.bookingsFor")} {format(selectedDate, "EEEE, MMMM d, yyyy")}</span></div>
              <Badge variant="secondary">{selectedDateBookings.length} {t("sidebar.bookings").toLowerCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {selectedDateBookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" /><p>{t("calendar.noBookingsDate")}</p></div>
            ) : (
              <div className="space-y-4">
                {selectedDateBookings.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((booking) => (
                  <Card key={booking.id} className={cn("border", getStatusColor(booking.status))}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={cn("p-3 rounded-lg border", getStatusColor(booking.status))}>{getStatusIcon(booking.status)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-semibold">{booking.space?.name}</h3>
                              <Badge variant="outline" className="text-xs">{booking.space?.type}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{booking.user?.name}</span></div>
                              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{booking.startTime} - {booking.endTime}</span></div>
                            </div>
                          </div>
                        </div>
                        <Badge className={cn("capitalize", getStatusColor(booking.status))}>{booking.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
