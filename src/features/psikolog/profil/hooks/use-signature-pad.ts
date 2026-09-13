"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { uploadMySignature } from "../api";

function dataUrlToPngFile(dataUrl: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header?.match(/:(.*?);/)?.[1] ?? "image/png";
  const bytes = Uint8Array.from(atob(base64 ?? ""), (c) => c.charCodeAt(0));
  return new File([bytes], "signature.png", { type: mime });
}

export function useUploadSignature(onSaved: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const { data } = await uploadMySignature(file);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      toast.success("Tanda tangan tersimpan.");
      onSaved();
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["psikolog", "profile"] });
    },
  });
}

export { dataUrlToPngFile };
