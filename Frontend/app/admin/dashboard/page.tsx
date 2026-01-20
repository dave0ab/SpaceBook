'use client';

"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { useAdminBookings, useAdminUsers, useBookingsByUserDetailed, useBookingsBySpaceDetailed, useApprovedReservationsByDate, useRejectedReservationsByDate, useRejectedReservationsByUser } from "@/lib/hooks/use-admin"
import { ClipboardList, CheckCircle, Clock, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useTranslations } from '@/lib/i18n'
import { TimePeriodSelector, TimePeriod } from '@/components/admin/time-period-selector'
import { StatisticsTable, Column } from '@/components/admin/statistics-table'

export default function AdminDashboardPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('thisMonth');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings()
  const { data: users = [], isLoading: usersLoading } = useAdminUsers()
  const { data: bookingsByUserDetailed = [], isLoading: bookingsByUserDetailedLoading } = useBookingsByUserDetailed(startDate, endDate)
  const { data: bookingsBySpaceDetailed = [], isLoading: bookingsBySpaceDetailedLoading } = useBookingsBySpaceDetailed(startDate, endDate)
  const { data: approvedByDate = {}, isLoading: approvedByDateLoading } = useApprovedReservationsByDate(startDate, endDate)
  const { data: rejectedByDate = {}, isLoading: rejectedByDateLoading } = useRejectedReservationsByDate(startDate, endDate)
  const { data: rejectedByUser = [], isLoading: rejectedByUserLoading } = useRejectedReservationsByUser(startDate, endDate)
  
  const t = useTranslations()

  const handleTimePeriodChange = (period: TimePeriod, start: string, end: string) => {
    setTimePeriod(period);
    setStartDate(start);
    setEndDate(end);
  };

  // Filter bookings by date range for stats
  const filteredBookings = useMemo(() => {
    if (!startDate || !endDate) return bookings;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= start && bookingDate <= end;
    });
  }, [bookings, startDate, endDate]);

  const pendingBookings = filteredBookings.filter((b) => b.status === "pending")
  const approvedBookings = filteredBookings.filter((b) => b.status === "approved")
  const rejectedBookings = filteredBookings.filter((b) => b.status === "rejected")
  const totalBookings = filteredBookings.length

  const stats = [
    {
      label: t('dashboard.totalReservations'),
      value: totalBookings,
      icon: ClipboardList,
      color: "text-primary",
      percentage: '100%',
    },
    {
      label: t('booking.approved'),
      value: approvedBookings.length,
      icon: CheckCircle,
      color: "text-status-approved",
      percentage: totalBookings > 0 ? `${Math.round((approvedBookings.length / totalBookings) * 100)}%` : '0%',
    },
    {
      label: t('booking.rejected'),
      value: rejectedBookings.length,
      icon: XCircle,
      color: "text-status-rejected",
      percentage: totalBookings > 0 ? `${Math.round((rejectedBookings.length / totalBookings) * 100)}%` : '0%',
    },
    {
      label: t('dashboard.pendingRequests'),
      value: pendingBookings.length,
      icon: Clock,
      color: "text-status-pending",
      percentage: totalBookings > 0 ? `${Math.round((pendingBookings.length / totalBookings) * 100)}%` : '0%',
    },
  ]

  // Prepare table data
  const reservationsByUserData = useMemo(() => {
    return bookingsByUserDetailed.map(item => ({
      userName: item.userName,
      email: item.userEmail,
      total: item.total,
      approved: item.approved,
      rejected: item.rejected,
      pending: item.pending,
      percentage: totalBookings > 0 ? `${Math.round((item.total / totalBookings) * 100)}%` : '0%',
    }));
  }, [bookingsByUserDetailed, totalBookings]);

  const reservationsBySpaceData = useMemo(() => {
    return bookingsBySpaceDetailed.map(item => ({
      spaceName: item.spaceName,
      type: item.spaceType,
      total: item.total,
      approved: item.approved,
      rejected: item.rejected,
      pending: item.pending,
      percentage: totalBookings > 0 ? `${Math.round((item.total / totalBookings) * 100)}%` : '0%',
    }));
  }, [bookingsBySpaceDetailed, totalBookings]);

  const approvedByDateData = useMemo(() => {
    const totalApproved = approvedBookings.length;
    return Object.entries(approvedByDate)
      .map(([date, count]) => ({
        date: format(new Date(date), 'MMM d, yyyy'),
        dateKey: date,
        count,
        percentage: totalApproved > 0 ? `${Math.round((count / totalApproved) * 100)}%` : '0%',
      }))
      .sort((a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime());
  }, [approvedByDate, approvedBookings.length]);

  const rejectedByDateData = useMemo(() => {
    const totalRejected = rejectedBookings.length;
    return Object.entries(rejectedByDate)
      .map(([date, count]) => ({
        date: format(new Date(date), 'MMM d, yyyy'),
        dateKey: date,
        count,
        percentage: totalRejected > 0 ? `${Math.round((count / totalRejected) * 100)}%` : '0%',
      }))
      .sort((a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime());
  }, [rejectedByDate, rejectedBookings.length]);

  const rejectedByUserData = useMemo(() => {
    const totalRejected = rejectedBookings.length;
    return rejectedByUser.map(item => ({
      userName: item.userName,
      email: item.userEmail,
      count: item.count,
      percentage: totalRejected > 0 ? `${Math.round((item.count / totalRejected) * 100)}%` : '0%',
    }));
  }, [rejectedByUser, rejectedBookings.length]);

  // Define table columns
  const reservationsByUserColumns: Column<typeof reservationsByUserData[0]>[] = [
    { key: 'userName', label: t('dashboard.userName'), sortable: true },
    { key: 'email', label: t('dashboard.email'), sortable: true },
    { key: 'total', label: t('dashboard.total'), sortable: true },
    { key: 'approved', label: t('booking.approved'), sortable: true },
    { key: 'rejected', label: t('booking.rejected'), sortable: true },
    { key: 'pending', label: t('booking.pending'), sortable: true },
    { key: 'percentage', label: t('dashboard.percentage'), sortable: true },
  ];

  const reservationsBySpaceColumns: Column<typeof reservationsBySpaceData[0]>[] = [
    { key: 'spaceName', label: t('dashboard.spaceName'), sortable: true },
    { key: 'type', label: t('spaces.type'), sortable: true, render: (value) => t(`spaces.${value}`) },
    { key: 'total', label: t('dashboard.total'), sortable: true },
    { key: 'approved', label: t('booking.approved'), sortable: true },
    { key: 'rejected', label: t('booking.rejected'), sortable: true },
    { key: 'pending', label: t('booking.pending'), sortable: true },
    { key: 'percentage', label: t('dashboard.percentage'), sortable: true },
  ];

  const approvedByDateColumns: Column<typeof approvedByDateData[0]>[] = [
    { key: 'dateKey', label: t('booking.date'), sortable: true, render: (_, row) => row.date },
    { key: 'count', label: t('dashboard.count'), sortable: true },
    { key: 'percentage', label: t('dashboard.percentage'), sortable: true },
  ];

  const rejectedByDateColumns: Column<typeof rejectedByDateData[0]>[] = [
    { key: 'dateKey', label: t('booking.date'), sortable: true, render: (_, row) => row.date },
    { key: 'count', label: t('dashboard.count'), sortable: true },
    { key: 'percentage', label: t('dashboard.percentage'), sortable: true },
  ];

  const rejectedByUserColumns: Column<typeof rejectedByUserData[0]>[] = [
    { key: 'userName', label: t('dashboard.userName'), sortable: true },
    { key: 'email', label: t('dashboard.email'), sortable: true },
    { key: 'count', label: t('dashboard.count'), sortable: true },
    { key: 'percentage', label: t('dashboard.percentage'), sortable: true },
  ];

  const isLoading = bookingsLoading || usersLoading || bookingsByUserDetailedLoading || bookingsBySpaceDetailedLoading || 
                    approvedByDateLoading || rejectedByDateLoading || rejectedByUserLoading;

  if (isLoading && !startDate) {
    return (
      <div className="flex items-center justify-center p-4 md:p-6 min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
          {/* Time Period Selector */}
          <Card className="bg-card border-border mb-6 md:mb-8">
            <CardContent className="p-4 md:p-6">
              <TimePeriodSelector value={timePeriod} onChange={handleTimePeriodChange} />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.percentage}</p>
                    </div>
                    <div className={`p-2 md:p-3 rounded-lg bg-secondary ${stat.color}`}>
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reservations by User Table */}
          <StatisticsTable
            title={t('dashboard.reservationsByUser')}
            data={reservationsByUserData}
            columns={reservationsByUserColumns}
            isLoading={bookingsByUserDetailedLoading}
            className="mb-6 md:mb-8"
          />

          {/* Reservations by Space Table */}
          <StatisticsTable
            title={t('dashboard.reservationsBySpace')}
            data={reservationsBySpaceData}
            columns={reservationsBySpaceColumns}
            isLoading={bookingsBySpaceDetailedLoading}
            className="mb-6 md:mb-8"
          />

          {/* Approved and Rejected by Date - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatisticsTable
              title={t('dashboard.approvedReservations')}
              data={approvedByDateData}
              columns={approvedByDateColumns}
              isLoading={approvedByDateLoading}
            />
            <StatisticsTable
              title={t('dashboard.rejectedReservations')}
              data={rejectedByDateData}
              columns={rejectedByDateColumns}
              isLoading={rejectedByDateLoading}
            />
          </div>

          {/* Rejected Reservations by User Table */}
          <StatisticsTable
            title={t('dashboard.rejectedByUser')}
            data={rejectedByUserData}
            columns={rejectedByUserColumns}
            isLoading={rejectedByUserLoading}
            className="mb-6 md:mb-8"
          />

          {/* Recent Booking Requests */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-base md:text-lg font-semibold">{t('booking.recentBookings')}</h3>
                <Link href="/admin/bookings">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    {t('booking.viewAll')}
                  </Button>
                </Link>
              </div>
              <div className="space-y-3 md:space-y-4">
                {pendingBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 md:p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm md:text-base truncate">{booking.space?.name || 'Unknown Space'}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          <span className="block sm:inline">{booking.user?.name || 'Unknown User'}</span>
                          <span className="hidden sm:inline"> • </span>
                          <span className="block sm:inline">{format(new Date(booking.date), "MMM d, yyyy")}</span>
                          <span className="hidden sm:inline"> • </span>
                          <span className="block sm:inline">{booking.startTime} - {booking.endTime}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-status-pending/20 text-status-pending flex-shrink-0 self-start sm:self-auto">
                      {t('booking.pending')}
                    </Badge>
                  </div>
                ))}
                {pendingBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-6 md:py-8 text-sm md:text-base">{t('booking.noBookings')}</p>
                )}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
