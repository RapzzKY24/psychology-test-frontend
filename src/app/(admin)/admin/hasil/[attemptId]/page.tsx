import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ScoreSummary } from "@/components/shared/score-summary";
import { ResubmitButton } from "@/features/admin/results-monitor/components/resubmit-button";
import { ResultStatusBadge } from "@/components/admin/result-status-badge";
import { fetchAdminResultServer } from "@/features/admin/results-monitor/api.server";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Detail Hasil" };

export default async function AdminResultDetailPage({
  params,
}: PageProps<"/admin/hasil/[attemptId]">) {
  const { attemptId } = await params;

  let view;
  try {
    const response = await fetchAdminResultServer(attemptId);
    view = response.data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const { result, interpretation } = view;
  const corrected = Boolean(result.correctedPatternCode || result.correctedScores);
  const patternCode = result.correctedPatternCode ?? result.patternCode;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-6">
      <PageHeader
        title="Detail Hasil"
        description={`Diselesaikan ${formatIdDate(result.computedAt)} · attempt ${attemptId.slice(0, 8)}…`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <ResultStatusBadge status={result.status} />
        {result.verifyCode && (
          <span className="rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums">
            Kode verifikasi: {result.verifyCode}
          </span>
        )}
        {result.status === "RETURNED" && <ResubmitButton resultId={result.id} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan skor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreSummary scores={result.scores} />
          <p className="text-xs text-muted-foreground">
            Kode pola:{" "}
            <span className="font-mono font-medium text-foreground">{patternCode || "—"}</span>
          </p>
        </CardContent>
      </Card>

      {corrected && (
        <Card className="border-chart-3/40">
          <CardHeader>
            <CardTitle className="text-base">Dikoreksi oleh psikolog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {result.correctedPatternCode && (
              <p>
                Pola koreksi:{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {result.correctedPatternCode}
                </span>
              </p>
            )}
            {result.correctionReason && <p>Alasan: {result.correctionReason}</p>}
          </CardContent>
        </Card>
      )}

      {interpretation ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{interpretation.title}</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-line text-sm leading-relaxed">
            {interpretation.body}
          </CardContent>
        </Card>
      ) : (
        <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Interpretasi untuk pola ini belum tersedia.
        </p>
      )}

      <Link href="/admin/hasil" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke monitor hasil
      </Link>
    </main>
  );
}
