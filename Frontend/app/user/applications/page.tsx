import { fetchBookings, fetchCurrentUser } from "@/lib/server-api";
import { getTranslations } from "@/lib/i18n-server";
import { ApplicationsContent } from "@/components/user/ApplicationsContent";

export const dynamic = "force-dynamic";

export default async function UserApplicationsPage() {
  const [user, t] = await Promise.all([
    fetchCurrentUser(),
    getTranslations(),
  ]);

  const bookings = user ? await fetchBookings({ userId: user.id }) : [];

  return (
    <ApplicationsContent 
      initialUser={user} 
      initialBookings={bookings || []} 
    />
  );
}
