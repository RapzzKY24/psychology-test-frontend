"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { downloadInstansiInvoicePdf } from "../api";

/** Unduh PDF invoice dari halaman tagihan instansi. */
export function useDownloadInstansiInvoicePdf() {
  return useMutation({
    mutationFn: ({ id, number }: { id: string; number: string }) =>
      downloadInstansiInvoicePdf(id, number),
    meta: { silentError: true },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
