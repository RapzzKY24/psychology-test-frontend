"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResubmitResult } from "../hooks/use-resubmit-result";

/** Sends a RETURNED result back to the psychologist queue (PENDING_REVIEW). */
export function ResubmitButton({ resultId }: { resultId: string }) {
  const mutation = useResubmitResult(resultId, () => {});

  return (
    <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
      <RotateCcw className="size-4" aria-hidden />
      {mutation.isPending ? "Mengirim..." : "Kirim Ulang ke Psikolog"}
    </Button>
  );
}
