import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
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

  // Two families produce no score the participant could read: a work curve and
  // a set of drawings are both interpreted by the psychologist.
  const isTimedGrid = detail.scorerType === "TIMED_GRID";
  const isManual = detail.scorerType === "MANUAL";
  const readByPsychologist = isTimedGrid || isManual;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-6">
      <PageHeader
        title="Hasil Tes"
        description={`Selesai pada ${formatIdDate(detail.completedAt)} · Kode verifikasi tersedia pada laporan resmi.`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {readByPsychologist ? "Status hasil" : "Ringkasan skor"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {readByPsychologist ? (
            <div className="flex items-start gap-3 rounded-xl border bg-primary/5 p-4">
              <ClipboardCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div className="space-y-1">
                <p className="text-sm font-medium">Hasil sudah selesai</p>
                <p className="text-sm text-muted-foreground">
                  {isManual
                    ? "Tes ini dibaca langsung oleh psikolog dari gambar Anda, jadi ringkasannya disampaikan pada sesi konsultasi."
                    : "Tes ini dinilai dari kurva kerja Anda, jadi ringkasannya disampaikan langsung oleh psikolog pada sesi konsultasi."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <ScoreSummary scores={detail.scores} />
              <p className="text-xs text-muted-foreground">
                Kode pola:{" "}
                <span className="font-mono font-medium text-foreground">
                  {detail.patternCode}
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {readByPsychologist ? null : detail.interpretation ? (
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
