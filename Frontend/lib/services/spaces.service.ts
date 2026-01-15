import { apiClient, handleApiError } from '../api-client';
import { API_CONFIG } from '../api.config';

export interface Space {
  id: string;
  name: string;
  type: 'auditorium' | 'gym' | 'soccer';
  capacity: number;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    bookings: number;
  };
}

export const spacesService = {
  async getAll(type?: string): Promise<Space[]> {
    try {
      const url = type 
        ? API_CONFIG.ENDPOINTS.SPACES.BY_TYPE(type)
        : API_CONFIG.ENDPOINTS.SPACES.BASE;
      const response = await apiClient.get<Space[]>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<Space> {
    try {
      const response = await apiClient.get<Space>(
        API_CONFIG.ENDPOINTS.SPACES.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};













