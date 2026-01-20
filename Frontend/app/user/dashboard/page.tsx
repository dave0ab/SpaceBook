import { Suspense } from "react";
import { DashboardContent } from "@/components/user/DashboardContent";

export default function UserDashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
