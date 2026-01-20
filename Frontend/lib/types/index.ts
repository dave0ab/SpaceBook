// Shared types that match backend API responses

export type SpaceType = 'auditorium' | 'gym' | 'soccer';
export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive';
export type BookingStatus = 'pending' | 'approved' | 'rejected';
export type NotificationType = 'booking_request' | 'status_update' | 'system';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  capacity: number;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    bookings: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    bookings: number;
  };
}

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
  space?: Space;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

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

















