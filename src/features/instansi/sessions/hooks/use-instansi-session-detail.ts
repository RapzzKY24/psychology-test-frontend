"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { InstansiSessionDetail } from "@/lib/api/types";
import { fetchInstansiSessionDetail } from "../api";
import { SESSION_DETAIL_POLL_MS } from "../constants";

/**
 * Session detail with the batch invoice. Polls only while that invoice is
 * still UNPAID, so the page flips to ACTIVE right after settlement.
 */
export function useInstansiSessionDetail(sessionId: string, initial: InstansiSessionDetail) {
  return useQuery({
    queryKey: qk.instansi.sessions.detail(sessionId),
    queryFn: async () => (await fetchInstansiSessionDetail(sessionId)).data,
    initialData: initial,
    refetchInterval: (query) =>
      query.state.data?.invoice?.status === "UNPAID" ? SESSION_DETAIL_POLL_MS : false,
  });
}
