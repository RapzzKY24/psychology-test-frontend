"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { SessionSummary } from "@/lib/api/types";
import { closeInstansiSession } from "../api";

/**
 * Closes a batch session. Pass `listKey` only when a rendered list holds the
 * same query key — the detail page has no list to patch, so it just refetches.
 */
export function useCloseInstansiSession(
  sessionId: string,
  onClosed: () => void,
  listKey?: QueryKey,
) {
  const queryClient = useQueryClient();
  const list = useOptimisticList<SessionSummary>(listKey ?? qk.instansi.sessions.all);

  return useMutation({
    mutationFn: async () => {
      const { data } = await closeInstansiSession(sessionId);
      return data;
    },
    meta: { silentError: true },
    onMutate: async () => {
      if (!listKey) return undefined;
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) =>
          row.id === sessionId ? asOptimistic({ ...row, status: "CLOSED" }) : row,
        ),
      );
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: () => {
      toast.success("Sesi ditutup.");
      onClosed();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.instansi.sessions.all }),
  });
}
