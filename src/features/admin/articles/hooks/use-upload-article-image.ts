"use client";

import { useState } from "react";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { uploadArticleImage } from "../api";

/**
 * Uploads one picture for an article block and hands back the stored URL. A
 * failed upload is a toast, not inline state: the block keeps whatever picture
 * it already had.
 */
export function useUploadArticleImage({
  onUploaded,
}: {
  onUploaded: (mediaUrl: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      onUploaded(await uploadArticleImage(file));
    } catch (error) {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
