import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { QueryResultsItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { ResubmitButton } from "./resubmit-button";
import { ResultStatusBadge } from "./result-status-badge";

interface ResultsTableProps {
  rows: QueryResultsItem[];
  meta: PaginationMeta;
  status?: string;
}

export function ResultsTable({ rows, meta, status }: ResultsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada hasil"
        description="Hasil peserta muncul di sini setelah mereka menyelesaikan tes."
        filtered={Boolean(status)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (status) p.set("status", status);
    return `/admin/hasil?${p.toString()}`;
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
              <TableHead>Pola</TableHead>
              <TableHead>Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-56">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.resultId}>
                <TableCell className="font-medium">{row.participantName}</TableCell>
                <TableCell>{row.testName}</TableCell>
                <TableCell>{row.sessionTitle}</TableCell>
                <TableCell className="tabular-nums">
                  {row.correctedPatternCode ?? row.patternCode ?? "—"}
                  {row.correctedPatternCode && (
                    <span className="ml-1 text-xs text-muted-foreground">(koreksi)</span>
                  )}
                </TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.completedAt)}</TableCell>
                <TableCell>
                  <ResultStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  {row.status === "RETURNED" ? (
                    <ResubmitButton resultId={row.resultId} />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {row.status === "PENDING_REVIEW" ? "menunggu psikolog" : "selesai"}
                    </span>
                  )}
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
