import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { fetchMeAttemptsServer, fetchMeResultsServer } from "@/features/participant/api";
import { AttemptCard } from "@/features/participant/components/attempt-card";
import { ResultCard } from "@/features/participant/components/result-card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [attemptsPage, resultsPage] = await Promise.all([
    fetchMeAttemptsServer(1),
    fetchMeResultsServer(1),
  ]);

  const activeAttempts = attemptsPage.data.filter(
    (attempt) => attempt.status !== "ABANDONED" && attempt.resultStatus !== "APPROVED",
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 p-6">
      <PageHeader
        title="Dashboard"
        description="Riwayat tes dan hasil yang sudah dirilis psikolog."
      />

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Sedang berjalan</h2>
        {activeAttempts.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Tidak ada tes yang sedang berjalan. Ikuti sesi dari institusi atau beli tes di katalog.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeAttempts.map((attempt) => (
              <AttemptCard key={attempt.id} attempt={attempt} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Hasil tersedia</h2>
        {resultsPage.data.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Belum ada hasil yang dirilis. Hasil tampil di sini setelah psikolog menyetujui.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {resultsPage.data.map((result) => (
              <ResultCard key={result.attemptId} result={result} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
