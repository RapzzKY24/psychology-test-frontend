"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/features/admin/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { SessionSummary } from "@/lib/api/types";
import { closeSession, createSession, updateSession } from "../api";
import type { CreateSessionInput, SessionUpdatePayload } from "../schemas";

export function useCreateSession(listKey: QueryKey, onCreated: (created: SessionSummary) => void) {
  const list = useOptimisticList<SessionSummary>(listKey);

  return useMutation({
    mutationFn: async (values: CreateSessionInput) => {
      const payload = {
        ...values,
        institutionId: values.institutionId || undefined,
        pin: values.pin || undefined,
        expiresAt: new Date(values.expiresAt).toISOString(),
      };
      const { data } = await createSession(payload);
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
          institutionId: values.institutionId || null,
          token: "",
          slotLimit: values.slotLimit,
          expiresAt: new Date(values.expiresAt).toISOString(),
          status: "ACTIVE",
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
  });
}

export function useCloseSession(listKey: QueryKey, sessionId: string, onClosed: () => void) {
  const list = useOptimisticList<SessionSummary>(listKey);

  return useMutation({
    mutationFn: async () => {
      const { data } = await closeSession(sessionId);
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

export function useUpdateSession(sessionId: string, onUpdated: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SessionUpdatePayload) => {
      const { data } = await updateSession(sessionId, payload);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      toast.success("Sesi diperbarui.");
      void queryClient.invalidateQueries({ queryKey: qk.admin.sessions.all });
      onUpdated();
    },
    onError: (error) => toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE),
  });
}
