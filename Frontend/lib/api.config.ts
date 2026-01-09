// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4253/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    USERS: {
      BASE: '/users',
      BY_ID: (id: string) => `/users/${id}`,
    },
    SPACES: {
      BASE: '/spaces',
      BY_ID: (id: string) => `/spaces/${id}`,
      BY_TYPE: (type: string) => `/spaces?type=${type}`,
    },
    BOOKINGS: {
      BASE: '/bookings',
      BY_ID: (id: string) => `/bookings/${id}`,
      BY_STATUS: (status: string) => `/bookings?status=${status}`,
    },
    NOTIFICATIONS: {
      BASE: '/notifications',
      UNREAD: '/notifications/unread',
      UNREAD_COUNT: '/notifications/unread/count',
      BY_ID: (id: string) => `/notifications/${id}`,
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: '/notifications/read/all',
    },
  },
} as const;

