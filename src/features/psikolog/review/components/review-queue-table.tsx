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
import { formatIdDate } from "@/lib/format/format-date";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { ReviewListItem } from "@/lib/api/types";

interface ReviewQueueTableProps {
  rows: ReviewListItem[];
  meta: PaginationMeta;
  status?: string;
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
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Peserta</TableHead>
              <TableHead>Tes</TableHead>
              <TableHead>Sesi</TableHead>
              <TableHead>Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.resultId}>
                <TableCell className="font-medium">{row.participantName}</TableCell>
                <TableCell>{row.testName}</TableCell>
                <TableCell>{row.sessionTitle}</TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.completedAt)}</TableCell>
                <TableCell>
                  <ResultStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/psikolog/review/${row.resultId}`}>Tinjau</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
