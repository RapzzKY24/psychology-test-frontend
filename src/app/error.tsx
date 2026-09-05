"use client";

import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary (root). Never renders the raw error message —
 * only the digest id for support correlation.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Terjadi kesalahan</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Sesuatu ada yang salah di sisi kami. Coba ulangi, atau kembali lagi nanti.
      </p>
      {error.digest && <p className="text-xs text-muted-foreground">Kode: {error.digest}</p>}
      <Button onClick={reset}>Coba lagi</Button>
    </main>
  );
}
