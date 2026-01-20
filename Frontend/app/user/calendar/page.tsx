import { Suspense } from "react";
import { CalendarContent } from "@/components/user/CalendarContent";

export default function UserCalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarContent />
    </Suspense>
  );
}
