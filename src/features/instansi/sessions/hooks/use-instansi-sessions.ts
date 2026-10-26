"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { SessionSummary } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import { fetchInstansiSessions } from "../api";

/** Session list page; the cache entry is what optimistic close patches. */
export function useInstansiSessions(page: number, initial: ApiSuccess<SessionSummary[]>) {
  return useQuery({
    queryKey: qk.instansi.sessions.list({ page }),
    queryFn: () => fetchInstansiSessions({ page }),
    initialData: initial,
  });
}
