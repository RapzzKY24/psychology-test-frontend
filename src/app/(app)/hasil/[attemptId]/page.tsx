import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { fetchMeResultDetailServer } from "@/features/participant/api";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Hasil Tes" };

/** Scores JSONB is family-shaped; flatten one level for the bar display. */
function toBars(scores: Record<string, number>): Array<{ label: string; value: number }> {
  const bars: Array<{ label: string; value: number }> = [];
  for (const [key, value] of Object.entries(scores)) {
    if (typeof value === "number") bars.push({ label: key, value });
    continue;
  }
  return bars;
}

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

  const bars = toBars(detail.scores);
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-6">
      <PageHeader
        title="Hasil Tes"
        description={`Selesai pada ${formatIdDate(detail.completedAt)} · Kode verifikasi tersedia pada laporan resmi.`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Pola hasil:{" "}
            <span className="font-semibold text-primary tabular-nums">{detail.patternCode}</span>
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
