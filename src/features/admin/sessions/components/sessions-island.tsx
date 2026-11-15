"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { SessionSummary } from "@/lib/api/types";
import { useSessionsList } from "../hooks/use-sessions-list";
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
  const { rows, meta } = useSessionsList({ listKey, initial, page });

  return <SessionsTable rows={rows} meta={meta} />;
}
