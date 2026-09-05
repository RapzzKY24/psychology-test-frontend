"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import { resubmitResult } from "../api";

/** Sends a RETURNED result back to the psychologist queue (PENDING_REVIEW). */
export function ResubmitButton({ resultId }: { resultId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await resubmitResult(resultId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.results.all });
      toast.success("Hasil dikirim ulang ke antrean psikolog.");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE),
  });

  return (
    <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
      <RotateCcw className="size-4" aria-hidden />
      {mutation.isPending ? "Mengirim..." : "Kirim Ulang ke Psikolog"}
    </Button>
  );
}
