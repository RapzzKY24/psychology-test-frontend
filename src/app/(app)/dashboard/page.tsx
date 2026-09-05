import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Clock, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  fetchMeAttemptsServer,
  fetchMeResultsServer,
} from "@/features/participant/api";
import type { MeAttemptItem, MeResultItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

function AttemptCard({ attempt }: { attempt: MeAttemptItem }) {
  const inProgress = attempt.status === "IN_PROGRESS";
  const waiting = attempt.status === "COMPLETED" && attempt.resultStatus === "PENDING_REVIEW";
  const returned = attempt.status === "COMPLETED" && attempt.resultStatus === "RETURNED";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {inProgress ? <Clock className="size-4 text-primary" aria-hidden /> : <FileText className="size-4 text-muted-foreground" aria-hidden />}
          {attempt.testName}
        </CardTitle>
        <CardDescription>
          {inProgress && "Belum selesai — lanjutkan kapan saja."}
          {waiting && "Menunggu review psikolog."}
          {returned && "Dikembalikan ke psikolog untuk diproses ulang."}
          {!inProgress && !waiting && !returned && "Sedang diproses."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inProgress && (
          <Link
            href={`/tes/${attempt.id}`}
            className="inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Lanjutkan Tes
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function ResultCard({ result }: { result: MeResultItem }) {
  return (
    <Link href={`/hasil/${result.attemptId}`} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleCheck className="size-4 text-primary" aria-hidden />
            {result.testName}
          </CardTitle>
          <CardDescription className="tabular-nums">
            Pola {result.patternCode} · {formatIdDate(result.completedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm font-medium text-primary">Lihat hasil</span>
        </CardContent>
      </Card>
    </Link>
  );
}

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
