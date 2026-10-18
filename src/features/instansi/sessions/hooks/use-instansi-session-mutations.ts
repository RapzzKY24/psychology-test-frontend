"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { InstansiBatchCreateResult, SessionSummary } from "@/lib/api/types";
import { closeInstansiSession, createInstansiSession } from "../api";
import type { CreateInstansiSessionInput } from "../schemas";

export function useCreateInstansiSession(
  listKey: QueryKey,
  onCreated: (created: InstansiBatchCreateResult) => void,
) {
  const list = useOptimisticList<SessionSummary>(listKey);

  return useMutation({
    mutationFn: async (values: CreateInstansiSessionInput) => {
      const { data } = await createInstansiSession(values);
      return data;
    },
    meta: { silentError: true },
    onMutate: async (values) => {
      const rollback = list.begin();
      list.patch((rows) => [
        asOptimistic({
          id: `optimistic-${Date.now()}`,
          title: values.title,
          kind: "GROUP",
          institutionId: null,
          token: "",
          slotLimit: values.slotLimit,
          expiresAt: new Date(values.expiresAt).toISOString(),
          status: "PENDING_PAYMENT",
        }),
        ...rows,
      ]);
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => list.refetch(),
    onSuccess: (created) => onCreated(created),
  });
}

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
