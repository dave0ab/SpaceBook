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

