'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsService } from '../services/bookings.service';
import { usersService } from '../services/users.service';
import type { BookingStatus } from '../types';

// Hook to get all bookings (admin view)
export function useAdminBookings(status?: BookingStatus, date?: string) {
  return useQuery({
    queryKey: ['admin-bookings', status, date],
    queryFn: () => bookingsService.getAll(status, undefined, date),
  });
}

// Hook to get all users (admin only)
export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => usersService.getAll(),
  });
}

// Hook to approve/reject bookings
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: BookingStatus }) =>
      bookingsService.update(bookingId, { status }),
    onSuccess: () => {
      // Invalidate all booking queries to refetch
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking-counts'] });
    },
    onError: (error: any) => {
      console.error('Failed to update booking status:', error);
      alert(error.response?.data?.message || 'Failed to update booking status');
    },
  });
}

// Hook to get booking counts by date range
export function useAdminBookingCounts(startDate: string, endDate: string) {
  return useQuery<Record<string, number>>({
    queryKey: ['admin-booking-counts', startDate, endDate],
    queryFn: () => bookingsService.getCounts(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

// Hook to get bookings by user
export function useBookingsByUser(startDate?: string, endDate?: string, status?: BookingStatus) {
  return useQuery({
    queryKey: ['bookings-by-user', startDate, endDate, status],
    queryFn: () => bookingsService.getBookingsByUser(startDate, endDate, status),
    enabled: true,
  });
}

// Hook to get bookings by space
export function useBookingsBySpace(startDate?: string, endDate?: string, status?: BookingStatus) {
  return useQuery({
    queryKey: ['bookings-by-space', startDate, endDate, status],
    queryFn: () => bookingsService.getBookingsBySpace(startDate, endDate, status),
    enabled: true,
  });
}

// Hook to get approved reservations by date
export function useApprovedReservationsByDate(startDate: string, endDate: string) {
  return useQuery<Record<string, number>>({
    queryKey: ['approved-reservations-by-date', startDate, endDate],
    queryFn: () => bookingsService.getApprovedReservationsByDate(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

// Hook to get rejected reservations by date
export function useRejectedReservationsByDate(startDate: string, endDate: string) {
  return useQuery<Record<string, number>>({
    queryKey: ['rejected-reservations-by-date', startDate, endDate],
    queryFn: () => bookingsService.getRejectedReservationsByDate(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

// Hook to get rejected reservations by user
export function useRejectedReservationsByUser(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['rejected-reservations-by-user', startDate, endDate],
    queryFn: () => bookingsService.getRejectedReservationsByUser(startDate, endDate),
    enabled: true,
  });
}

// Hook to get detailed bookings by user with status breakdown
export function useBookingsByUserDetailed(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['bookings-by-user-detailed', startDate, endDate],
    queryFn: () => bookingsService.getBookingsByUserDetailed(startDate, endDate),
    enabled: true,
  });
}

// Hook to get detailed bookings by space with status breakdown
export function useBookingsBySpaceDetailed(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['bookings-by-space-detailed', startDate, endDate],
    queryFn: () => bookingsService.getBookingsBySpaceDetailed(startDate, endDate),
    enabled: true,
  });
}

