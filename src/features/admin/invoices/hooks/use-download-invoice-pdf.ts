"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { downloadInvoicePdf } from "../api";

/** Unduh PDF invoice dari dialog detail admin. */
export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: ({ id, number }: { id: string; number: string }) =>
      downloadInvoicePdf(id, number),
    meta: { silentError: true },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
