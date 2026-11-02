"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { downloadReportPdf } from "../api";

/** Renders on demand (1–3 s) — the backend has no PDF cache yet. */
export function useDownloadReportPdf() {
  return useMutation({
    mutationFn: ({ id, number }: { id: string; number: string | null }) =>
      downloadReportPdf(id, number),
    meta: { silentError: true },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
