'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { getAccessToken, clearTokens } from '../api-client';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const loadUser = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          try {
            // Try to get user info from token
            const userInfo = await authService.getCurrentUser();
            // Ensure role is set - if JWT doesn't have it, log a warning
            if (!userInfo.role) {
              console.warn('User role not found in token, defaulting to user');
              userInfo.role = 'user';
            }
            setUser(userInfo);
          } catch (error) {
            // Token might be invalid or expired, clear it
            console.error('Failed to load user:', error);
            clearTokens();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in loadUser:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      // Redirect based on user role
      if (response.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role?: 'user' | 'admin') => {
    try {
      const response = await authService.register({ name, email, password, role });
      setUser(response.user);
      router.push('/user/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/user/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

