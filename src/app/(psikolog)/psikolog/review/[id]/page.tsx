import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewAnswerSection } from "@/features/psikolog/review/components/review-answer-section";
import { ReviewDetailActions } from "@/features/psikolog/review/components/review-detail-actions";
import { ReviewScoreCards } from "@/features/psikolog/review/components/review-score-cards";
import {
  MultiSubtestProfileCard,
  isMultiSubtestScores,
} from "@/features/psikolog/review/components/multi-subtest-profile-card";
import {
  WorkCurveChart,
  isTimedGridScores,
} from "@/features/psikolog/review/components/work-curve-chart";
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
    detail = (await fetchReviewDetailServer(id)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const { result } = detail;

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title={`${detail.test.name} — ${detail.participant.name}`}
        description={`${detail.session.title} · selesai ${formatIdDate(detail.attempt.completedAt)}`}
      />

      <ReviewDetailActions result={result} />

      <ReviewScoreCards
        patternCode={result.patternCode}
        scores={result.scores}
        correctedPatternCode={result.correctedPatternCode}
        correctedScores={result.correctedScores}
        correctionReason={result.correctionReason}
      />

      {isMultiSubtestScores(result.scores) && (
        <MultiSubtestProfileCard scores={result.scores} />
      )}

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

      {isTimedGridScores(result.scores) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kurva kerja</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkCurveChart scores={result.scores} />
          </CardContent>
        </Card>
      )}

      <ReviewAnswerSection detail={detail} scores={result.scores} />
    </main>
  );
}
