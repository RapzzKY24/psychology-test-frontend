"use client";

import { ResultStatusBadge } from "@/components/admin/result-status-badge";
import { formatIdDate } from "@/lib/format/format-date";
import { safeRenderScores } from "@/lib/format/format-scores";
import type { ReviewListItem } from "@/lib/api/types";
import { ReviewRowActions } from "./review-queue-actions";

/** Mobile card view of the review queue. */
export function ReviewQueueCards({ rows }: { rows: ReviewListItem[] }) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((row) => {
        const scoreText = safeRenderScores(row.scores, row.patternCode);
        return (
          <div key={row.resultId} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{row.participantName}</p>
              <ResultStatusBadge status={row.status} />
            </div>
            <p
              className="truncate text-sm text-muted-foreground"
              title={row.institutionName?.trim() || undefined}
            >
              {row.institutionName?.trim() || "—"} · {row.testName}
            </p>
            <p className="truncate font-mono text-xs" title={scoreText === "—" ? undefined : scoreText}>
              {scoreText}
            </p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {formatIdDate(row.completedAt)} · {row.sessionTitle}
            </p>
            <ReviewRowActions
              resultId={row.resultId}
              isApproved={row.status === "APPROVED"}
              stretch
            />
          </div>
        );
      })}
    </div>
  );
}
