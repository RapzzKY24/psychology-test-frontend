"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CertificateFormData } from "@/lib/api/types";
import { useUploadCertificatePhoto } from "../hooks/use-certificate-mutations";

const MAX_BYTES = 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg"];

interface CertificatePhotoFieldProps {
  certificateId: string;
  photoPath: string | null;
  /** Bumped after each upload so the browser re-requests the replaced file. */
  cacheKey: string;
  onSaved: (form: CertificateFormData) => void;
}

/**
 * The photo is printed inside a 3×4 frame, so the field shows that frame: a
 * portrait image is what the template expects and what the crop hint asks for.
 */
export function CertificatePhotoField({
  certificateId,
  photoPath,
  cacheKey,
  onSaved,
}: CertificatePhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const upload = useUploadCertificatePhoto(certificateId, onSaved);

  // Object URLs live until they are revoked; the file is already in memory.
  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  const pick = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Format file tidak didukung (PNG/JPG).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ukuran file terlalu besar (maks 1MB).");
      return;
    }

    setPendingPreview(URL.createObjectURL(file));
    upload.mutate(file, {
      onSettled: () => setPendingPreview(null),
    });
  };

  // The photo is personal data, so the backend streams it behind auth instead
  // of mounting uploads/certificates as public static.
  const previewSrc =
    pendingPreview ??
    (photoPath ? `/api/v1/certificates/${certificateId}/photo?v=${cacheKey}` : null);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="certificate-photo">Foto 3×4</FieldLabel>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex aspect-[3/4] w-28 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/30">
          {previewSrc ? (
            // User-uploaded file served by the backend; next/image adds nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="Foto peserta" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
          )}
        </div>

        <div className="min-w-56 flex-1 space-y-2">
          <Input
            ref={inputRef}
            id="certificate-photo"
            type="file"
            accept="image/png,image/jpeg"
            disabled={upload.isPending}
            onChange={(e) => pick(e.target.files?.[0])}
            className="h-9"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" aria-hidden />
            {upload.isPending ? "Mengunggah..." : "Unggah foto"}
          </Button>
          <FieldDescription>
            Pas foto berwarna, rasio 3×4, maksimal 1MB. Wajib sebelum sertifikat diterbitkan.
          </FieldDescription>
          {error && <FieldError>{error}</FieldError>}
        </div>
      </div>
    </Field>
  );
}
