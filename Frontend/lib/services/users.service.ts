import { apiClient, handleApiError } from '../api-client';
import { API_CONFIG } from '../api.config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    bookings: number;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
  avatar?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
  avatar?: string;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(API_CONFIG.ENDPOINTS.USERS.BASE);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(API_CONFIG.ENDPOINTS.USERS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async create(data: CreateUserDto): Promise<User> {
    try {
      const response = await apiClient.post<User>(API_CONFIG.ENDPOINTS.USERS.BASE, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const response = await apiClient.patch<User>(API_CONFIG.ENDPOINTS.USERS.BY_ID(id), data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_CONFIG.ENDPOINTS.USERS.BY_ID(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};


