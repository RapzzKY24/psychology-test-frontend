"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { ResultStatusBadge } from "@/components/admin/result-status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatIdDate } from "@/lib/format/format-date";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { ReviewListItem } from "@/lib/api/types";

interface ReviewQueueTableProps {
  rows: ReviewListItem[];
  meta: PaginationMeta;
  status?: string;
}

function safeRenderScores(scores: unknown, patternCode: string): string {
  if (!patternCode) return "—";
  if (!scores) return patternCode;
  try {
    const graph = (scores as { graph?: unknown })?.graph ?? scores;
    const text = JSON.stringify(graph);
    const truncated = text.length > 60 ? `${text.slice(0, 60)}…` : text;
    return `${patternCode} · ${truncated}`;
  } catch {
    return patternCode;
  }
}

export function ReviewQueueTable({ rows, meta, status }: ReviewQueueTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Antrean kosong"
        description="Hasil yang butuh peninjauan akan muncul di sini."
        filtered={Boolean(status)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (status) p.set("status", status);
    return `/psikolog/review?${p.toString()}`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="hidden overflow-hidden rounded-lg border md:block">
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
                const institutionText = row.institutionName ?? "—";
                const isApproved = row.status === "APPROVED";
                return (
                  <TableRow key={row.resultId}>
                    <TableCell className="font-medium">{row.participantName}</TableCell>
                    <TableCell
                      className="max-w-[12rem] truncate"
                      title={row.institutionName ?? undefined}
                    >
                      {institutionText}
                    </TableCell>
                    <TableCell>{row.testName}</TableCell>
                    <TableCell
                      className="max-w-[14rem] truncate font-mono text-xs"
                      title={scoreText}
                    >
                      {scoreText}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatIdDate(row.completedAt)}</TableCell>
                    <TableCell>
                      <ResultStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/psikolog/review/${row.resultId}`}>
                            {isApproved ? "Detail" : "Tinjau"}
                          </Link>
                        </Button>
                        {isApproved && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span tabIndex={0}>
                                <Button variant="outline" size="sm" disabled aria-disabled>
                                  Rilis Hasil
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Segera hadir — hold</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-3 md:hidden">
          {rows.map((row) => {
            const scoreText = safeRenderScores(row.scores, row.patternCode);
            const isApproved = row.status === "APPROVED";
            return (
              <div key={row.resultId} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{row.participantName}</p>
                  <ResultStatusBadge status={row.status} />
                </div>
                <p className="truncate text-sm text-muted-foreground" title={row.institutionName ?? undefined}>
                  {row.institutionName ?? "—"} · {row.testName}
                </p>
                <p className="truncate font-mono text-xs" title={scoreText}>
                  {scoreText}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {formatIdDate(row.completedAt)} · {row.sessionTitle}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/psikolog/review/${row.resultId}`}>{isApproved ? "Detail" : "Tinjau"}</Link>
                  </Button>
                  {isApproved && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="flex-1">
                          <Button variant="outline" size="sm" disabled aria-disabled className="w-full">
                            Rilis Hasil
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Segera hadir — hold</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <TablePagination meta={meta} pageHref={pageHref} />
      </div>
    </TooltipProvider>
  );
}
