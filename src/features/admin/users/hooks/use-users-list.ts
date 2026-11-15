"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminUser, UserRole } from "@/lib/api/types";
import { fetchAdminUsers } from "../api";

/**
 * The admin user list, seeded with the RSC's first page. It stays in the query
 * cache so a role change can update the row without refetching the page.
 */
export function useUsersList({
  listKey,
  initial,
  page,
  role,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<AdminUser[]>;
  page: number;
  role?: string;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchAdminUsers({ page, role: role as UserRole | undefined }),
    initialData: initial,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
