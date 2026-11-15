"use client";

import { useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useItemImageUpload } from "../hooks/use-item-image-upload";

interface ItemImageUploadProps {
  testId: string;
  value?: string | null;
  /** Validation message from the form schema, shown next to the picker. */
  serverError?: string | null;
  onChange: (imageUrl: string | null) => void;
}

export function ItemImageUpload({ testId, value, serverError, onChange }: ItemImageUploadProps) {
  const { inputRef, preview, error, pending, pick, clear } = useItemImageUpload({
    testId,
    onChange,
  });
  const [loadError, setLoadError] = useState(false);

  const displayUrl = preview ?? value ?? null;
  const shownError = error ?? serverError ?? null;

  // Reset load error when the displayed image changes. Done during render
  // (React docs "adjusting state on prop change") instead of useEffect to
  // avoid synchronous setState-in-effect cascading renders.
  const [prevDisplayUrl, setPrevDisplayUrl] = useState(displayUrl);
  if (displayUrl !== prevDisplayUrl) {
    setPrevDisplayUrl(displayUrl);
    setLoadError(false);
  }

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
              onClick={() => {
                clear();
                setLoadError(false);
              }}
              aria-label="Hapus gambar"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-white px-4 py-8 text-center">
            <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Belum ada gambar. Unggah PNG/JPG maks 2MB.
            </p>
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            disabled={pending}
            // Cleared after every pick so choosing the same file twice still
            // fires a change event.
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              setLoadError(false);
              void pick(file);
            }}
            className="hidden"
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
      {shownError && <FieldError>{shownError}</FieldError>}
    </Field>
  );
}
