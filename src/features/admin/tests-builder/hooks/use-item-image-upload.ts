"use client";

import { useEffect, useRef, useState } from "react";
import { uploadItemImage } from "../api";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg"];

/**
 * Item figure picker: validates locally, uploads immediately (one request per
 * file) and hands the stored URL back. The preview is a local object URL, so
 * the picture appears before the upload finishes.
 */
export function useItemImageUpload({
  testId,
  onChange,
}: {
  testId: string;
  onChange: (imageUrl: string | null) => void;
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
      const { data } = await uploadItemImage(testId, file);
      onChange(data.imageUrl);
      setPreview(null);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar.");
      setPreview(null);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setPending(false);
    }
  };

  const clear = () => {
    setError(null);
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return { inputRef, preview, error, pending, pick, clear };
}
