import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateUserButton } from "@/features/admin/users/components/create-user-dialog";
import { UserFilters } from "@/features/admin/users/components/user-filters";
import { UsersTable } from "@/features/admin/users/components/users-table";
import { fetchAdminUsersServer } from "@/features/admin/users/api.server";
import { UsersIsland } from "@/features/admin/users/components/users-island";
import { qk } from "@/lib/api/query-keys";
import { getServerSession } from "@/lib/api/server";
import { USER_ROLES } from "@/lib/api/types";
import type { UserRole } from "@/lib/api/types";

export const metadata: Metadata = { title: "Manajemen Pengguna" };

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const role = USER_ROLES.includes(sp.role as UserRole) ? (sp.role as UserRole) : undefined;

  const [session, { data, meta }] = await Promise.all([
    getServerSession(),
    fetchAdminUsersServer({ page, role }),
  ]);

  const listKey = qk.admin.users.list({ page, role });

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Manajemen Pengguna"
          description="Kelola akun dan role: admin, psikolog, dan peserta."
        />
        <CreateUserButton listKey={listKey} />
      </div>
      <UserFilters role={role} />
      <UsersIsland
        listKey={listKey}
        initial={{ data }}
        page={page}
        role={role}
        currentUserId={session?.user.id ?? ""}
      />
    </main>
  );
}
