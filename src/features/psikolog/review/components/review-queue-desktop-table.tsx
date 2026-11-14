"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultStatusBadge } from "@/components/admin/result-status-badge";
import { formatIdDate } from "@/lib/format/format-date";
import { safeRenderScores } from "@/lib/format/format-scores";
import type { ReviewListItem } from "@/lib/api/types";
import { ReviewRowActions } from "./review-queue-actions";

/** Desktop table view of the review queue. */
export function ReviewQueueDesktopTable({ rows }: { rows: ReviewListItem[] }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border sm:block">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Peserta</TableHead>
            <TableHead>Institusi</TableHead>
            <TableHead>Tes</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Selesai</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-36">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const scoreText = safeRenderScores(row.scores, row.patternCode);
            return (
              <TableRow key={row.resultId}>
                <TableCell className="font-medium">{row.participantName}</TableCell>
                <TableCell
                  className="max-w-[12rem] truncate"
                  title={row.institutionName?.trim() || undefined}
                >
                  {row.institutionName?.trim() || "—"}
                </TableCell>
                <TableCell>{row.testName}</TableCell>
                <TableCell
                  className="max-w-[14rem] truncate text-sm text-muted-foreground"
                  title={scoreText === "—" ? undefined : scoreText}
                >
                  {scoreText}
                </TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.completedAt)}</TableCell>
                <TableCell>
                  <ResultStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <ReviewRowActions
                    resultId={row.resultId}
                    isApproved={row.status === "APPROVED"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
