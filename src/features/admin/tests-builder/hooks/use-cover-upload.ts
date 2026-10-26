"use client";

import { useEffect, useRef, useState } from "react";
import { isApiError } from "@/lib/api/client";
import type { AdminTest } from "@/lib/api/types";
import { updateTest, uploadTestCover } from "../api";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg"];

/**
 * Catalog cover uploader: validates locally, uploads immediately (one request
 * per file) and reports the updated test. `null` clears the cover.
 */
export function useCoverUpload({
  testId,
  onChanged,
}: {
  testId: string;
  onChanged: (updated: AdminTest) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Format file tidak didukung (PNG/JPG).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ukuran file terlalu besar (maks 2MB).");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPending(true);
    try {
      const { data } = await uploadTestCover(testId, file);
      onChanged(data);
      setPreview(null);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar.");
      setPreview(null);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = async () => {
    setError(null);
    setPending(true);
    try {
      const { data } = await updateTest(testId, { imageUrl: null });
      onChanged(data);
    } catch (e) {
      setError(
        isApiError(e) && e.isNotFound
          ? "Tes tidak ditemukan."
          : e instanceof Error
            ? e.message
            : "Gagal menghapus gambar.",
      );
    } finally {
      setPending(false);
    }
  };

  return { inputRef, preview, error, pending, pick, clear };
}
