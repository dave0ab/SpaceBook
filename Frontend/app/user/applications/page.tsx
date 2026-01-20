import { Suspense } from "react";
import { ApplicationsContent } from "@/components/user/ApplicationsContent";

export default function UserApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <ApplicationsContent />
    </Suspense>
  );
}
