import { apiClient, handleApiError } from '../api-client';
import { API_CONFIG } from '../api.config';

export type NotificationType = 'booking_request' | 'status_update' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  bookingId?: string;
  booking?: {
    id: string;
    spaceId: string;
    date: string;
    startTime: string;
    endTime: string;
    space?: {
      id: string;
      name: string;
      type: string;
    };
  };
}

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<Notification[]>(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.BASE
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getUnread(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<Notification[]>(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      // Backend returns just a number directly
      const response = await apiClient.get<number>(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
      );
      return typeof response.data === 'number' ? response.data : 0;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<Notification> {
    try {
      const response = await apiClient.get<Notification>(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await apiClient.patch<Notification>(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

