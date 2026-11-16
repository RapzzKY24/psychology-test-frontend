"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch, isApiError } from "@/lib/api/client";

export function ResetExpiredAttempt() {
  const [attemptId, setAttemptId] = useState("");
  const [newAttemptId, setNewAttemptId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reset() {
    setBusy(true);
    setError(null);
    setNewAttemptId(null);
    try {
      const result = await apiFetch<{ newAttemptId: string }>(
        `/admin/attempts/${encodeURIComponent(attemptId.trim())}/reset-expired`,
        { method: "POST" },
      );
      setNewAttemptId(result.data.newAttemptId);
    } catch (cause) {
      setError(isApiError(cause) ? cause.message : "Gagal mengulang attempt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-xl border p-4" aria-label="Pemulihan attempt">
      <h2 className="font-semibold">Pulihkan tes yang gagal terkirim</h2>
      <p className="text-sm text-muted-foreground">
        Masukkan nomor attempt dari peserta. Jawaban lama disimpan sebagai riwayat.
      </p>
      <div className="flex flex-wrap gap-2">
        <Input
          aria-label="Nomor attempt"
          className="min-w-64 flex-1"
          value={attemptId}
          onChange={(event) => setAttemptId(event.target.value)}
          placeholder="UUID attempt"
        />
        <Button type="button" disabled={busy || !attemptId.trim()} onClick={() => void reset()}>
          {busy ? "Memproses..." : "Buat attempt baru"}
        </Button>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {newAttemptId ? (
        <p role="status" className="text-sm">
          Attempt baru: <code className="break-all">{newAttemptId}</code>. Minta peserta membuka ulang
          dashboard atau tautan undangan. Untuk sesi roster, peserta perlu mengambil kursinya kembali.
        </p>
      ) : null}
    </section>
  );
}
