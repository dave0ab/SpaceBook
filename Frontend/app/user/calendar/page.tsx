import { fetchBookingCounts, fetchBookings, fetchCurrentUser } from "@/lib/server-api";
import { getTranslations } from "@/lib/i18n-server";
import { CalendarContent } from "@/components/user/CalendarContent";
import { startOfMonth, endOfMonth, format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function UserCalendarPage() {
  const [user, t] = await Promise.all([
    fetchCurrentUser(),
    getTranslations(),
  ]);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const todayStr = format(now, "yyyy-MM-dd");

  const [initialCounts, initialBookings] = user 
    ? await Promise.all([
        fetchBookingCounts(format(monthStart, "yyyy-MM-dd"), format(monthEnd, "yyyy-MM-dd"), user.id),
        fetchBookings({ userId: user.id, date: todayStr })
      ])
    : [{}, []];

  return (
    <CalendarContent 
      initialUser={user} 
      initialCounts={initialCounts} 
      initialBookings={initialBookings} 
    />
  );
}
