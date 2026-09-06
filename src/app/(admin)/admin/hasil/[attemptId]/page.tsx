import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ResubmitButton } from "@/features/admin/results-monitor/components/resubmit-button";
import { ResultStatusBadge } from "@/features/admin/results-monitor/components/result-status-badge";
import { fetchAdminResultServer } from "@/features/admin/results-monitor/api.server";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Detail Hasil" };

/** Scores JSONB is family-shaped; flatten one level for the bar display. */
function toBars(scores: Record<string, number>): Array<{ label: string; value: number }> {
  const bars: Array<{ label: string; value: number }> = [];
  for (const [key, value] of Object.entries(scores)) {
    if (typeof value === "number") bars.push({ label: key, value });
  }
  return bars;
}

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
  const bars = toBars(result.scores);
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);
  const corrected = Boolean(result.correctedPatternCode || result.correctedScores);

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
          <CardTitle className="text-lg">
            Pola hasil:{" "}
            <span className="font-semibold text-primary tabular-nums">
              {result.correctedPatternCode ?? result.patternCode ?? "—"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bars.length > 0 &&
            bars.map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{bar.label}</span>
                  <span className="tabular-nums text-muted-foreground">{bar.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.max((bar.value / maxValue) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
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
