import { notFound } from "next/navigation";
import { isApiError } from "@/lib/api/client";
import { fetchSessionPreviewServer } from "@/features/guest/api.server";
import { isSessionExpired } from "@/features/guest/lib/session-state";
import { SessionPreviewCard } from "@/features/guest/components/session-preview-card";
import { JoinView } from "@/features/guest/components/join-view";
import { RosterClaimView } from "@/features/guest/components/roster-claim-view";
import { SessionGate } from "@/features/guest/components/session-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Gabung Sesi" };

export default async function JoinPage({ params }: PageProps<"/join/[token]">) {
  const { token } = await params;

  let preview;
  try {
    const response = await fetchSessionPreviewServer(token);
    preview = response.data;
  } catch (error) {
    // Unknown token must not leak anything — a neutral dead-end page.
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const expired = isSessionExpired(preview.expiresAt);
  const closed = preview.status === "CLOSED";
  const unpaid = preview.status === "PENDING_PAYMENT";
  const unavailable = closed || expired || unpaid;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 px-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Gabung Sesi Tes</h1>
        <p className="text-sm text-muted-foreground">
          Periksa detail sesi, lalu isi data diri untuk mulai mengerjakan.
        </p>
      </div>

      {unavailable ? (
        <Card>
          <CardHeader>
            <CardTitle>{unpaid ? "Tes belum dibuka" : "Sesi tidak tersedia"}</CardTitle>
            <CardDescription>
              {unpaid
                ? "Penyelenggara belum menyelesaikan pembayaran sesi ini. Hubungi petugas untuk info pembayaran — halaman ini otomatis aktif setelah pembayaran terkonfirmasi."
                : closed
                  ? "Sesi ini sudah ditutup oleh penyelenggara."
                  : "Sesi ini sudah melewati waktu kedaluwarsa."}
              {!unpaid && " Hubungi penyelenggara untuk mendapatkan tautan sesi baru."}
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      ) : (
        <SessionGate token={token}>
          <SessionPreviewCard preview={preview} />
          {preview.joinMode === "ROSTER" ? (
            <RosterClaimView token={token} roster={preview.roster ?? []} />
          ) : (
            <JoinView token={token} preview={preview} />
          )}
        </SessionGate>
      )}
    </main>
  );
}
