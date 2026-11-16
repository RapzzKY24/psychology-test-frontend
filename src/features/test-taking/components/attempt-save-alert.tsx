"use client";

import { Button } from "@/components/ui/button";

export function AttemptSaveAlert({
  attemptId,
  expired,
  canRetry,
  onRetry,
}: {
  attemptId: string;
  expired: boolean;
  canRetry: boolean;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm">
      <p className="font-semibold">Sebagian jawaban belum tersimpan. Tes belum dikirim.</p>
      {expired ? (
        <p className="mt-2">
          Waktu tes sudah habis. Hubungi admin untuk mengulang tes dan berikan nomor attempt:
          <code className="ml-1 break-all font-mono">{attemptId}</code>
        </p>
      ) : (
        <>
          <p className="mt-2">Periksa koneksi, lalu coba simpan lagi. Jika halaman sempat dimuat ulang, pilih ulang jawaban yang belum tersimpan.</p>
          {canRetry ? (
            <Button type="button" variant="outline" className="mt-3" onClick={onRetry}>
              Coba simpan lagi
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}
