import { fetchAdminBookings, fetchAdminSpaces } from "@/lib/server-api";
import { getTranslations } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";
import { BookingsManagement } from "@/components/admin/bookings/bookings-management";

export default async function AdminBookingsPage() {
  const [bookings, spaces, t] = await Promise.all([
    fetchAdminBookings().catch(() => []),
    fetchAdminSpaces().catch(() => []),
    getTranslations(),
  ]);

  return (
    <main className="flex-1 p-4 md:p-6">
      <BookingsManagement initialBookings={bookings} spaces={spaces} />
    </main>
  );
}
