"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import {
  addInstansiParticipants,
  removeInstansiParticipant,
  resetInstansiParticipant,
  swapInstansiParticipant,
} from "../api";

/**
 * Roster mutations for one batch. Every call refetches the session detail so
 * the participant rows and the invoice amount stay in sync (edits are only
 * allowed while the invoice is UNPAID — the server enforces `batch_locked`).
 */
export function useInstansiRosterMutations(sessionId: string) {
  const queryClient = useQueryClient();
  const detailKey = qk.instansi.sessions.detail(sessionId);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: detailKey });
  const reportError = (error: unknown) =>
    toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);

  const add = useMutation({
    mutationFn: (employeeIds: string[]) =>
      addInstansiParticipants(sessionId, employeeIds).then((r) => r.data),
    meta: { silentError: true },
    onError: reportError,
    onSuccess: () => toast.success("Peserta ditambahkan."),
    onSettled: invalidate,
  });

  const swap = useMutation({
    mutationFn: (vars: { participantId: string; employeeId: string }) =>
      swapInstansiParticipant(sessionId, vars.participantId, vars.employeeId).then((r) => r.data),
    meta: { silentError: true },
    onError: reportError,
    onSuccess: () => toast.success("Peserta diganti."),
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: (participantId: string) =>
      removeInstansiParticipant(sessionId, participantId).then((r) => r.data),
    meta: { silentError: true },
    onError: reportError,
    onSuccess: () => toast.success("Peserta dihapus."),
    onSettled: invalidate,
  });

  const reset = useMutation({
    mutationFn: (participantId: string) =>
      resetInstansiParticipant(sessionId, participantId).then((r) => r.data),
    meta: { silentError: true },
    onError: reportError,
    onSuccess: () => toast.success("Akses peserta dibuka — bisa diklaim ulang."),
    onSettled: invalidate,
  });

  return { add, swap, remove, reset };
}
