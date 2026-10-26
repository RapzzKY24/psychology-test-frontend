"use client";

import { qk } from "@/lib/api/query-keys";
import type { SessionSummary } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import { useInstansiSessions } from "../hooks/use-instansi-sessions";
import { InstansiSessionsTable } from "./instansi-sessions-table";

/** Client island — the list cache enables optimistic close. */
export function InstansiSessionsIsland({
  initial,
  page,
}: {
  initial: ApiSuccess<SessionSummary[]>;
  page: number;
}) {
  const { data } = useInstansiSessions(page, initial);

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return (
    <InstansiSessionsTable
      rows={data.data}
      meta={tableMeta}
      listKey={qk.instansi.sessions.list({ page })}
    />
  );
}
