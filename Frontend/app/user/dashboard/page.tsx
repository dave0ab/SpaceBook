import { fetchBookings, fetchCurrentUser } from "@/lib/server-api";
import { getTranslations } from "@/lib/i18n-server";
import { DashboardContent } from "@/components/user/DashboardContent";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const [user, t] = await Promise.all([
    fetchCurrentUser(),
    getTranslations(),
  ]);

  const bookings = user ? await fetchBookings({ userId: user.id }) : [];

  return (
    <DashboardContent 
      initialUser={user} 
      initialBookings={bookings || []} 
    />
  );
}
