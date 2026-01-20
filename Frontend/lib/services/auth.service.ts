import { apiClient, setTokens, clearTokens, handleApiError, getAccessToken } from '../api-client';
import { API_CONFIG } from '../api.config';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    avatar?: string;
    createdAt?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('spacebook_refresh_token');
      if (refreshToken) {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('spacebook_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      // Backend returns { user, accessToken, refreshToken }
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (error) {
      clearTokens();
      throw new Error(handleApiError(error));
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      // For now, we'll decode the JWT to get user info
      // In the future, we could add a /me endpoint
      const token = getAccessToken();
      if (!token) {
        throw new Error('No token available');
      }
      
      // Decode JWT payload (base64url decode)
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }
        
        const payload = JSON.parse(atob(parts[1]));
        
        // Validate role exists in token
        if (!payload.role) {
          throw new Error('Role not found in token');
        }
        
        return {
          id: payload.sub,
          email: payload.email || '',
          name: payload.name || payload.email?.split('@')[0] || 'User',
          role: payload.role, // Get role directly from token
          status: payload.status || 'active',
          avatar: payload.avatar,
        };
      } catch (decodeError) {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      clearTokens(); // Clear invalid token
      throw error;
    }
  },
};

