"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import { applyCorrection, approveReview, returnReview, saveReviewNotes } from "../api";
import type { CorrectionInput, ReturnReviewInput, ReviewNotesInput } from "../schemas";

function handleError(error: unknown) {
  toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
}

export function useApproveReview(resultId: string, onApproved: (verifyCode: string) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await approveReview(resultId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.reviews.all });
      toast.success("Hasil disetujui.");
      onApproved(data.verifyCode);
    },
    onError: handleError,
  });
}

export function useReturnReview(resultId: string, onReturned: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ReturnReviewInput) => {
      const { data } = await returnReview(resultId, values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.reviews.all });
      toast.success("Hasil dikembalikan.");
      onReturned();
    },
    onError: handleError,
  });
}

export function useSaveReviewNotes(resultId: string, onSaved: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ReviewNotesInput) => {
      const { data } = await saveReviewNotes(resultId, values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.reviews.all });
      toast.success("Catatan tersimpan.");
      onSaved();
    },
    onError: handleError,
  });
}

export function useApplyCorrection(resultId: string, onSaved: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CorrectionInput & { scores: Record<string, unknown> }) => {
      const { data } = await applyCorrection(resultId, values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.reviews.all });
      toast.success("Koreksi tersimpan.");
      onSaved();
    },
    onError: handleError,
  });
}
