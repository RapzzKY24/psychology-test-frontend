import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultStatusBadge } from "@/features/admin/results-monitor/components/result-status-badge";
import { ApproveButton, ReturnDialog } from "@/features/psikolog/review/components/review-actions";
import { ReviewCorrectionDialog } from "@/features/psikolog/review/components/review-correction-dialog";
import { ReviewNotesDialog } from "@/features/psikolog/review/components/review-notes-dialog";
import { fetchReviewDetailServer } from "@/features/psikolog/review/api.server";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";

export const metadata: Metadata = { title: "Detail Review" };

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let detail;
  try {
    const response = await fetchReviewDetailServer(id);
    detail = response.data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const { result } = detail;
  const isPending = result.status === "PENDING_REVIEW";

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title={`${detail.test.name} — ${detail.participant.name}`}
        description={`${detail.session.title} · selesai ${formatIdDate(detail.attempt.completedAt)}`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <ResultStatusBadge status={result.status} />
        {isPending && (
          <>
            <ApproveButton resultId={result.id} />
            <ReturnDialog resultId={result.id} />
          </>
        )}
        <ReviewNotesDialog resultId={result.id} initialNotes={result.notes ?? null} />
        <ReviewCorrectionDialog
          resultId={result.id}
          currentScores={result.correctedScores ?? result.scores}
          currentPatternCode={result.correctedPatternCode ?? result.patternCode}
        />
        <Link href="/psikolog/review" className="text-sm text-muted-foreground hover:underline">
          ← Kembali ke antrean
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skor sistem</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            <p>
              Pola: <span className="font-mono font-medium">{result.patternCode}</span>
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-xs">
              {JSON.stringify(result.scores, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Koreksi psikolog</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            {result.correctedPatternCode ? (
              <>
                <p>
                  Pola:{" "}
                  <span className="font-mono font-medium">{result.correctedPatternCode}</span>
                </p>
                <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-xs">
                  {JSON.stringify(result.correctedScores, null, 2)}
                </pre>
                {result.correctionReason && (
                  <p className="text-muted-foreground">{result.correctionReason}</p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Belum ada koreksi.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {detail.interpretation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{detail.interpretation.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {detail.interpretation.body}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jawaban per soal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Kata</TableHead>
                  <TableHead>Paling</TableHead>
                  <TableHead>Kurang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.itemsDetailed.map((item) => (
                  <TableRow key={item.itemOrder}>
                    <TableCell className="tabular-nums">{item.itemOrder}</TableCell>
                    <TableCell>{item.words.join(" · ")}</TableCell>
                    <TableCell className="tabular-nums">{item.most ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">{item.least ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
