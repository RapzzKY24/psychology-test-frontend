"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminUser, UserRole } from "@/lib/api/types";
import { fetchAdminUsers } from "../api";
import { UsersTable } from "./users-table";

/**
 * Client island: the list lives in the React Query cache (fed RSC
 * initialData) so mutations can update it optimistically.
 */
export function UsersIsland({
  listKey,
  initial,
  page,
  role,
  currentUserId,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<AdminUser[]>;
  page: number;
  role?: string;
  currentUserId: string;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchAdminUsers({ page, role: role as UserRole | undefined }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return (
    <UsersTable
      rows={data.data}
      meta={tableMeta}
      currentUserId={currentUserId}
      role={role}
      listKey={listKey}
    />
  );
}
