"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { downloadCertificatePdf, openCertificatePreview } from "../api";

/** Renders on demand (1–3 s) — the backend keeps no PDF cache. */
export function useDownloadCertificatePdf() {
  return useMutation({
    mutationFn: ({ id, number }: { id: string; number: string | null }) =>
      downloadCertificatePdf(id, number),
    meta: { silentError: true },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}

/** Opens the watermarked draft in a new tab, drawn from the stored rows. */
export function usePreviewCertificate() {
  return useMutation({
    mutationFn: (id: string) => openCertificatePreview(id),
    meta: { silentError: true },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
