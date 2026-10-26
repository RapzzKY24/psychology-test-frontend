"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AdminTest } from "@/lib/api/types";
import { useCoverUpload } from "../hooks/use-cover-upload";

interface CoverImageUploadProps {
  testId: string;
  value: string | null;
  disabled?: boolean;
  /** Receives the updated test so the parent can refresh its cache. */
  onChanged: (updated: AdminTest) => void;
}

/** Catalog cover picker — preview, upload and removal live in the hook. */
export function CoverImageUpload({ testId, value, disabled, onChanged }: CoverImageUploadProps) {
  const { inputRef, preview, error, pending, pick, clear } = useCoverUpload({
    testId,
    onChanged,
  });
  const displayUrl = preview ?? value;

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
