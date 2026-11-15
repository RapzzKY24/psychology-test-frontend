"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminUser } from "@/lib/api/types";
import { useUsersList } from "../hooks/use-users-list";
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
  const { rows, meta } = useUsersList({ listKey, initial, page, role });

  return (
    <UsersTable
      rows={rows}
      meta={meta}
      currentUserId={currentUserId}
      role={role}
      listKey={listKey}
    />
  );
}
