"use client";

import { useState } from "react";

/**
 * Shows the psychologist's saved signature exactly as documents receive it
 * (owner-scoped streaming endpoint). Parent remounts this via
 * `key={cacheKey}` after an upload replaces the file under the same URL —
 * resetting the error state.
 */
export function SignaturePreviewImage({ cacheKey }: { cacheKey: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-white p-2">
        <p className="text-sm text-muted-foreground">Gambar tersimpan tidak bisa dimuat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-32 items-center justify-center rounded-lg border bg-white p-2">
      {/* User-uploaded dynamic image — next/image processing is unnecessary here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/v1/psychologist/me/signature-image?t=${cacheKey}`}
        alt="Tanda tangan tersimpan"
        className="max-h-28 object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
