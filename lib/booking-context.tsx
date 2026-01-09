"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  bookings as initialBookings,
  users as initialUsers,
  notifications as initialNotifications,
  type Booking,
  type User,
  type Notification,
  type BookingStatus,
} from "./mock-data"

interface BookingContextType {
  bookings: Booking[]
  users: User[]
  notifications: Notification[]
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void
  addUser: (user: Omit<User, "id">) => void
  removeUser: (userId: string) => void
  markNotificationRead: (notificationId: string) => void
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const addBooking = useCallback((booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [...prev, newBooking])

    // Add notification for admin
    const adminNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: "admin-1",
      title: "New Booking Request",
      message: `New booking request for ${booking.spaceId}`,
      type: "booking_request",
      read: false,
      createdAt: new Date().toISOString(),
      bookingId: newBooking.id,
    }
    setNotifications((prev) => [adminNotification, ...prev])
  }, [])

  const updateBookingStatus = useCallback(
    (bookingId: string, status: BookingStatus) => {
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)))

      // Find the booking to get user info
      const booking = bookings.find((b) => b.id === bookingId)
      if (booking) {
        const userNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: booking.userId,
          title: status === "approved" ? "Booking Approved" : "Booking Rejected",
          message: `Your booking has been ${status}`,
          type: "status_update",
          read: false,
          createdAt: new Date().toISOString(),
          bookingId,
        }
        setNotifications((prev) => [userNotification, ...prev])
      }
    },
    [bookings],
  )

  const addUser = useCallback((user: Omit<User, "id">) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    }
    setUsers((prev) => [...prev, newUser])
  }, [])

  const removeUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }, [])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  return (
    <BookingContext.Provider
      value={{
        bookings,
        users,
        notifications,
        currentUser,
        setCurrentUser,
        addBooking,
        updateBookingStatus,
        addUser,
        removeUser,
        markNotificationRead,
        addNotification,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
