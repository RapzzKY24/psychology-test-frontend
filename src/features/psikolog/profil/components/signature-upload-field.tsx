"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUploadSignature } from "../hooks/use-signature-pad";

const MAX_BYTES = 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg"];

export function SignatureUploadField({ onSaved }: { onSaved: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mutation = useUploadSignature(onSaved);

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
    mutation.mutate(file);
  };

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="signature-upload">atau unggah foto TTD</FieldLabel>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id="signature-upload"
          type="file"
          accept="image/png,image/jpeg"
          disabled={mutation.isPending}
          onChange={(e) => pick(e.target.files?.[0])}
          className="h-11"
        />
        <Button
          type="button"
          variant="outline"
          disabled={mutation.isPending}
          onClick={() => inputRef.current?.click()}
          className="h-11 shrink-0"
        >
          <Upload className="size-4" aria-hidden />
          {mutation.isPending ? "Mengunggah..." : "Unggah"}
        </Button>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
