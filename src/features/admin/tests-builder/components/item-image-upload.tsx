"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { uploadItemImage } from "../api";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg"];

interface ItemImageUploadProps {
  testId: string;
  value?: string | null;
  onChange: (imageUrl: string | null) => void;
}

export function ItemImageUpload({ testId, value, onChange }: ItemImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const displayUrl = preview ?? value ?? null;

  // Reset load error when the displayed image changes. Done during render
  // (React docs "adjusting state on prop change") instead of useEffect to
  // avoid synchronous setState-in-effect cascading renders.
  const [prevDisplayUrl, setPrevDisplayUrl] = useState(displayUrl);
  if (displayUrl !== prevDisplayUrl) {
    setPrevDisplayUrl(displayUrl);
    setLoadError(false);
  }

  const pick = async (file: File | undefined) => {
    setError(null);
    setLoadError(false);
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
    setLoadError(false);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel>Gambar soal (opsional)</FieldLabel>
      <div className="rounded-lg border bg-muted/30 p-3">
        {displayUrl ? (
          <div className="relative overflow-hidden rounded-md border bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Gambar soal"
              className="mx-auto max-h-64 w-full object-contain p-2"
              onError={() => setLoadError(true)}
            />
            {loadError && (
              <p className="absolute inset-0 flex items-center justify-center bg-white/90 text-sm text-destructive">
                Gagal memuat gambar
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-2 top-2 size-7 bg-white shadow"
              onClick={clear}
              aria-label="Hapus gambar"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-white px-4 py-8 text-center">
            <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">Belum ada gambar. Unggah PNG/JPG maks 2MB.</p>
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            disabled={pending}
            onChange={(e) => void pick(e.target.files?.[0])}
            className="h-11"
          />
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="h-11 shrink-0"
          >
            <Upload className="size-4" aria-hidden />
            {pending ? "Mengunggah..." : "Unggah"}
          </Button>
        </div>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
