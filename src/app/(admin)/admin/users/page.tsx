import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TablePagination } from "@/components/admin/table-pagination";
import { CreateUserButton } from "@/features/admin/users/components/create-user-dialog";
import { UserFilters } from "@/features/admin/users/components/user-filters";
import { UsersTable } from "@/features/admin/users/components/users-table";
import { fetchAdminUsersServer } from "@/features/admin/users/api.server";
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

  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Manajemen Pengguna"
          description="Kelola akun dan role: admin, psikolog, dan peserta."
        />
        <CreateUserButton />
      </div>
      <UserFilters role={role} />
      <UsersTable
        rows={data}
        meta={tableMeta}
        currentUserId={session?.user.id ?? ""}
        role={role}
        page={page}
      />
    </main>
  );
}
