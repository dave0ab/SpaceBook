// Mock data for the Sports & Event Space Booking Platform

export type SpaceType = "auditorium" | "gym" | "soccer"

export interface Space {
  id: string
  name: string
  type: SpaceType
  capacity: number
  description: string
  image: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  status: "active" | "inactive"
  avatar: string
}

export type BookingStatus = "pending" | "approved" | "rejected"

export interface Booking {
  id: string
  userId: string
  spaceId: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "booking_request" | "status_update" | "system"
  read: boolean
  createdAt: string
  bookingId?: string
}

// Available Spaces
export const spaces: Space[] = [
  {
    id: "auditorium-1",
    name: "Main Auditorium",
    type: "auditorium",
    capacity: 500,
    description: "Large auditorium with state-of-the-art sound system and lighting",
    image: "/modern-auditorium-interior.jpg",
  },
  {
    id: "gym-1",
    name: "Multipurpose Gym",
    type: "gym",
    capacity: 200,
    description: "Versatile gymnasium suitable for basketball, volleyball, and events",
    image: "/indoor-gymnasium-sports-facility.jpg",
  },
  {
    id: "soccer-1",
    name: "Soccer Field A",
    type: "soccer",
    capacity: 50,
    description: "Professional-grade natural grass soccer field",
    image: "/soccer-field-at-sunset.jpg",
  },
  {
    id: "soccer-2",
    name: "Soccer Field B",
    type: "soccer",
    capacity: 50,
    description: "Synthetic turf field with lighting for night games",
    image: "/artificial-turf-soccer-field.png",
  },
  {
    id: "soccer-3",
    name: "Soccer Field C",
    type: "soccer",
    capacity: 40,
    description: "Training field ideal for practice sessions",
    image: "/soccer-training-field.jpg",
  },
  {
    id: "soccer-4",
    name: "Soccer Field D",
    type: "soccer",
    capacity: 40,
    description: "Indoor soccer field with climate control",
    image: "/indoor-soccer-field-arena.jpg",
  },
]

// Mock Users
export const users: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "user",
    status: "active",
    avatar: "/professional-man-avatar.png",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "user",
    status: "active",
    avatar: "/professional-woman-avatar.png",
  },
  {
    id: "user-3",
    name: "Mike Davis",
    email: "mike.d@example.com",
    role: "user",
    status: "active",
    avatar: "/confident-businessman.png",
  },
  {
    id: "user-4",
    name: "Emily Chen",
    email: "emily.c@example.com",
    role: "user",
    status: "inactive",
    avatar: "/asian-woman-professional.png",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@spacebook.com",
    role: "admin",
    status: "active",
    avatar: "/admin-user-avatar.png",
  },
]

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    spaceId: "auditorium-1",
    date: "2026-01-15",
    startTime: "09:00",
    endTime: "12:00",
    status: "approved",
    createdAt: "2026-01-05T10:00:00Z",
    notes: "Company annual meeting",
  },
  {
    id: "booking-2",
    userId: "user-2",
    spaceId: "gym-1",
    date: "2026-01-16",
    startTime: "14:00",
    endTime: "17:00",
    status: "pending",
    createdAt: "2026-01-08T14:30:00Z",
    notes: "Basketball tournament",
  },
  {
    id: "booking-3",
    userId: "user-1",
    spaceId: "soccer-1",
    date: "2026-01-17",
    startTime: "10:00",
    endTime: "12:00",
    status: "approved",
    createdAt: "2026-01-06T09:00:00Z",
  },
  {
    id: "booking-4",
    userId: "user-3",
    spaceId: "soccer-2",
    date: "2026-01-18",
    startTime: "16:00",
    endTime: "18:00",
    status: "rejected",
    createdAt: "2026-01-07T11:00:00Z",
    notes: "Soccer practice",
  },
  {
    id: "booking-5",
    userId: "user-2",
    spaceId: "auditorium-1",
    date: "2026-01-20",
    startTime: "13:00",
    endTime: "16:00",
    status: "pending",
    createdAt: "2026-01-09T08:00:00Z",
    notes: "Product launch event",
  },
  {
    id: "booking-6",
    userId: "user-3",
    spaceId: "gym-1",
    date: "2026-01-21",
    startTime: "08:00",
    endTime: "10:00",
    status: "approved",
    createdAt: "2026-01-04T15:00:00Z",
  },
  {
    id: "booking-7",
    userId: "user-1",
    spaceId: "soccer-3",
    date: "2026-01-22",
    startTime: "15:00",
    endTime: "17:00",
    status: "pending",
    createdAt: "2026-01-09T10:00:00Z",
  },
]

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "admin-1",
    title: "New Booking Request",
    message: "Sarah Johnson requested the Multipurpose Gym",
    type: "booking_request",
    read: false,
    createdAt: "2026-01-09T08:00:00Z",
    bookingId: "booking-2",
  },
  {
    id: "notif-2",
    userId: "admin-1",
    title: "New Booking Request",
    message: "Sarah Johnson requested the Main Auditorium",
    type: "booking_request",
    read: false,
    createdAt: "2026-01-09T08:00:00Z",
    bookingId: "booking-5",
  },
  {
    id: "notif-3",
    userId: "admin-1",
    title: "New Booking Request",
    message: "John Smith requested Soccer Field C",
    type: "booking_request",
    read: true,
    createdAt: "2026-01-09T10:00:00Z",
    bookingId: "booking-7",
  },
  {
    id: "notif-4",
    userId: "user-1",
    title: "Booking Approved",
    message: "Your booking for Main Auditorium has been approved",
    type: "status_update",
    read: false,
    createdAt: "2026-01-06T12:00:00Z",
    bookingId: "booking-1",
  },
  {
    id: "notif-5",
    userId: "user-3",
    title: "Booking Rejected",
    message: "Your booking for Soccer Field B was rejected",
    type: "status_update",
    read: true,
    createdAt: "2026-01-08T09:00:00Z",
    bookingId: "booking-4",
  },
]

// Helper functions
export function getSpaceById(id: string): Space | undefined {
  return spaces.find((space) => space.id === id)
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getBookingsByUserId(userId: string): Booking[] {
  return bookings.filter((booking) => booking.userId === userId)
}

export function getBookingsByStatus(status: BookingStatus): Booking[] {
  return bookings.filter((booking) => booking.status === status)
}

export function getNotificationsByUserId(userId: string): Notification[] {
  return notifications.filter((notif) => notif.userId === userId)
}

export function getUnreadNotificationsCount(userId: string): number {
  return notifications.filter((notif) => notif.userId === userId && !notif.read).length
}

export function getSpaceTypeColor(type: SpaceType): string {
  switch (type) {
    case "auditorium":
      return "bg-auditorium"
    case "gym":
      return "bg-gym"
    case "soccer":
      return "bg-soccer"
    default:
      return "bg-primary"
  }
}

export function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case "pending":
      return "bg-status-pending text-background"
    case "approved":
      return "bg-status-approved text-background"
    case "rejected":
      return "bg-status-rejected text-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

// Time slots for booking
export const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]
