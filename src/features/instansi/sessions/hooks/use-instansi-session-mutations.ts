"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { SessionSummary } from "@/lib/api/types";
import { closeInstansiSession } from "../api";

export function useCloseInstansiSession(
  listKey: QueryKey,
  sessionId: string,
  onClosed: () => void,
) {
  const list = useOptimisticList<SessionSummary>(listKey);

  return useMutation({
    mutationFn: async () => {
      const { data } = await closeInstansiSession(sessionId);
      return data;
    },
    meta: { silentError: true },
    onMutate: async () => {
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
    onSettled: () => list.refetch(),
  });
}
