"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { uploadQrisImage } from "../api";

export function useQrisUpload(onUploaded: () => void) {
  return useMutation({
    mutationFn: async (file: File) => uploadQrisImage(file),
    meta: { silentError: true },
    onSuccess: () => {
      toast.success("QRIS merchant terunggah.");
      onUploaded();
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
