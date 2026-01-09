import { apiClient, handleApiError } from '../api-client';
import { API_CONFIG } from '../api.config';

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface Booking {
  id: string;
  userId: string;
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  space?: {
    id: string;
    name: string;
    type: string;
    capacity: number;
    description: string;
    image: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateBookingDto {
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateBookingDto {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  notes?: string;
}

export const bookingsService = {
  async getAll(status?: BookingStatus, userId?: string, date?: string): Promise<Booking[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (userId) params.append('userId', userId);
      if (date) params.append('date', date);
      
      const query = params.toString();
      const url = query 
        ? `${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}?${query}`
        : API_CONFIG.ENDPOINTS.BOOKINGS.BASE;
      
      const response = await apiClient.get<Booking[]>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async create(data: CreateBookingDto): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async update(id: string, data: UpdateBookingDto): Promise<Booking> {
    try {
      const response = await apiClient.patch<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getCounts(startDate: string, endDate: string, userId?: string): Promise<Record<string, number>> {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      if (userId) params.append('userId', userId);
      
      const response = await apiClient.get<Record<string, number>>(
        `${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}/counts?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

