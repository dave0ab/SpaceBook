import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsService, type Booking, type CreateBookingDto, type UpdateBookingDto, type BookingStatus } from '../services/bookings.service';
import { notificationsService } from '../services/notifications.service';
import { toast } from 'sonner';

export function useBookings(status?: BookingStatus, userId?: string, date?: string) {
  return useQuery<Booking[]>({
    queryKey: ['bookings', status, userId, date],
    queryFn: () => bookingsService.getAll(status, userId, date),
  });
}

export function useBooking(id: string) {
  return useQuery<Booking>({
    queryKey: ['bookings', id],
    queryFn: () => bookingsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Booking created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingDto }) =>
      bookingsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Booking updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update booking');
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete booking');
    },
  });
}

export function useBookingCounts(startDate: string, endDate: string, userId?: string) {
  return useQuery<Record<string, number>>({
    queryKey: ['booking-counts', startDate, endDate, userId],
    queryFn: () => bookingsService.getCounts(startDate, endDate, userId),
    enabled: !!startDate && !!endDate,
  });
}

