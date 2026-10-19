"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { SessionSummary } from "@/lib/api/types";
import { fetchInstansiSessions } from "../api";
import { InstansiSessionsTable } from "./instansi-sessions-table";

/** Client island — the list cache enables optimistic close. */
export function InstansiSessionsIsland({
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
    queryFn: () => fetchInstansiSessions({ page }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return <InstansiSessionsTable rows={data.data} meta={tableMeta} listKey={listKey} />;
}
