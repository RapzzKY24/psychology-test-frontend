"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { isApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import type { SessionSummary } from "@/lib/api/types";
import { closeSession, createSession } from "../api";
import type { CreateSessionInput } from "../schemas";

export function useCreateSession(onCreated: (created: SessionSummary) => void) {
  const queryClient = useQueryClient();

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
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.sessions.all });
      toast.success("Sesi dibuat — bagikan tautan undangannya.");
      onCreated(created);
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(GENERIC_ERROR_MESSAGE);
    },
  });
}

export function useCloseSession(onClosed: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await closeSession(id);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.sessions.all });
      toast.success("Sesi ditutup.");
      onClosed();
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(GENERIC_ERROR_MESSAGE);
    },
  });
}
