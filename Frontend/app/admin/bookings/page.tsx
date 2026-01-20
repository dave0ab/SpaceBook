'use client';

import { BookingsManagement } from "@/components/admin/bookings/bookings-management";

export default function AdminBookingsPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <BookingsManagement />
    </main>
  );
}
