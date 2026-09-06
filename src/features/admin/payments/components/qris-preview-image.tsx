"use client";

import { useState } from "react";

/**
 * Shows the currently active merchant QRIS exactly as customers receive it
 * (public streaming endpoint). Parent remounts this via `key={cacheKey}` after
 * an upload replaces the file under the same URL — resetting the error state.
 */
export function QrisPreviewImage({ cacheKey }: { cacheKey: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-white p-2">
        <p className="text-sm text-muted-foreground">Belum ada gambar QRIS.</p>
      </div>
    );
  }

  return (
    <div className="flex h-48 items-center justify-center rounded-lg border bg-white p-2">
      {/* User-uploaded dynamic image — next/image processing is unnecessary here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/v1/public/payments/qris-image?t=${cacheKey}`}
        alt="Gambar QRIS merchant saat ini"
        className="max-h-44 object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
