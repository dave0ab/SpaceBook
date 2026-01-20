import { fetchAdminUsers } from "@/lib/server-api";
import { UsersManagement } from "@/components/admin/users/users-management";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await fetchAdminUsers().catch(() => []);

  return (
    <main className="flex-1 p-4 md:p-6">
      <UsersManagement initialUsers={users} />
    </main>
  );
}
