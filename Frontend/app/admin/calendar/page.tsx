import { fetchAdminSpaces } from "@/lib/server-api";
import { AdminCalendar } from "@/components/admin/calendar/admin-calendar";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const spaces = await fetchAdminSpaces().catch(() => []);

  return (
    <main className="flex-1 p-4 md:p-6">
      <AdminCalendar initialSpaces={spaces} />
    </main>
  );
}
