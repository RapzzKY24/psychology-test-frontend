"use client";

import { useState } from "react";
import { uploadItemImage } from "../api";

/**
 * Sends one finished drawing and returns the path the server stored. The
 * canvas flattening stays with the view — this only owns the request and the
 * saving flag the buttons read.
 */
export function useUploadDrawing() {
  const [saving, setSaving] = useState(false);

  const upload = async (
    attemptId: string,
    itemId: string,
    file: File,
    participantToken?: string,
  ): Promise<string> => {
    setSaving(true);
    try {
      const { data } = await uploadItemImage(
        attemptId,
        itemId,
        file,
        participantToken,
      );
      return data.imageUrl;
    } finally {
      setSaving(false);
    }
  };

  return { upload, saving };
}
