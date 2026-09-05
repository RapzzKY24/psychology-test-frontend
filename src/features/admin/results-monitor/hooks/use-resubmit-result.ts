"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import { resubmitResult } from "../api";

/** Sends a RETURNED result back to the psychologist queue (PENDING_REVIEW). */
export function useResubmitResult(resultId: string, onSaved: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await resubmitResult(resultId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.results.all });
      toast.success("Hasil dikirim ulang ke antrean psikolog.");
      onSaved();
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
