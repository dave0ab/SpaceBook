'use client';

import { UsersManagement } from "@/components/admin/users/users-management";

export default function AdminUsersPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <UsersManagement />
    </main>
  );
}
