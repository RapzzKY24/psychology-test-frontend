import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ScoreSummary } from "@/components/shared/score-summary";
import { fetchMeResultDetailServer } from "@/features/participant/api";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Hasil Tes" };

export default async function HasilDetailPage({ params }: PageProps<"/hasil/[attemptId]">) {
  const { attemptId } = await params;

  let detail;
  try {
    const response = await fetchMeResultDetailServer(attemptId);
    detail = response.data;
  } catch (error) {
    if (isApiError(error) && (error.isNotFound || error.isForbidden)) notFound();
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-6">
      <PageHeader
        title="Hasil Tes"
        description={`Selesai pada ${formatIdDate(detail.completedAt)} · Kode verifikasi tersedia pada laporan resmi.`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan skor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreSummary scores={detail.scores} />
          <p className="text-xs text-muted-foreground">
            Kode pola:{" "}
            <span className="font-mono font-medium text-foreground">{detail.patternCode}</span>
          </p>
        </CardContent>
      </Card>

      {detail.interpretation ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{detail.interpretation.title}</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-line text-sm leading-relaxed">
            {detail.interpretation.body}
          </CardContent>
        </Card>
      ) : (
        <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Interpretasi untuk pola ini sedang disiapkan.
        </p>
      )}

      <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
        ← Kembali ke dashboard
      </Link>
    </main>
  );
}
