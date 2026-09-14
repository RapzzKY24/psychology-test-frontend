"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
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

  const displayUrl = preview ?? value ?? null;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel>Gambar soal (opsional)</FieldLabel>
      {displayUrl && (
        <div className="relative overflow-hidden rounded-lg border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayUrl} alt="Preview gambar soal" className="max-h-48 w-full object-contain" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 size-7"
            onClick={clear}
            aria-label="Hapus gambar"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      <div className="flex gap-2">
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
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
