"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { downloadInstansiReportPdf } from "../api";

/** Render happens on demand (1–3 s) — the button shows a pending state. */
export function useDownloadInstansiReportPdf() {
  return useMutation({
    mutationFn: ({ id, number }: { id: string; number: string | null }) =>
      downloadInstansiReportPdf(id, number),
    meta: { silentError: true },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
