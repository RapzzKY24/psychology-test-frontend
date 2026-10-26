"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/lib/api/client";
import type { AdminTest } from "@/lib/api/types";
import { updateTest, uploadTestCover } from "../api";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg"];

interface CoverImageUploadProps {
  testId: string;
  value: string | null;
  disabled?: boolean;
  /** Receives the updated test so the parent can refresh its cache. */
  onChanged: (updated: AdminTest) => void;
}

/**
 * Catalog cover. Uploads immediately (one request per file) and stores the
 * returned test, so the cover never depends on the settings form being saved.
 */
export function CoverImageUpload({ testId, value, disabled, onChanged }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const displayUrl = preview ?? value;

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

  return (
    <Field data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Gambar katalog (opsional)</p>
          <FieldDescription>Tampil di kartu katalog dan halaman detail tes.</FieldDescription>
        </div>
        {displayUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || pending}
            onClick={() => void clear()}
          >
            <X className="size-4" aria-hidden />
            Hapus
          </Button>
        )}
      </div>

      <div className="bg-muted/30 overflow-hidden rounded-lg border">
        {displayUrl ? (
          // Plain <img>: the preview is a blob: URL, which next/image rejects.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayUrl}
            alt="Gambar katalog tes"
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <ImageIcon className="text-muted-foreground size-8" aria-hidden />
            <p className="text-muted-foreground text-sm">
              Belum ada gambar. Unggah PNG/JPG maks 2MB.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          disabled={disabled || pending}
          onChange={(e) => void pick(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || pending}
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          <Upload className="size-4" aria-hidden />
          {pending ? "Mengunggah..." : "Unggah"}
        </Button>
      </div>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
