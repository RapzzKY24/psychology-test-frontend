"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { SessionSummary } from "@/lib/api/types";
import { fetchSessions } from "../api";
import { SessionsTable } from "./sessions-table";

/** Client island — the list cache enables optimistic create/close. */
export function SessionsIsland({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<SessionSummary[]>;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchSessions({ page }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return <SessionsTable rows={data.data} meta={tableMeta} />;
}
