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
import { safeRenderScores } from "@/lib/format/format-scores";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { InstansiResultItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";

interface ResultsTableProps {
  rows: InstansiResultItem[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

/**
 * Institution results list. The per-candidate "Unduh PDF" action is deferred
 * to T19 (needs Feature 08) and intentionally not rendered yet.
 */
export function ResultsTable({ rows, meta, pageHref }: ResultsTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada hasil yang dirilis"
        description="Hasil yang sudah disetujui psikolog akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Peserta</TableHead>
              <TableHead>Tes</TableHead>
              <TableHead>Ringkasan</TableHead>
              <TableHead>Disetujui</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.resultId}>
                <TableCell className="font-medium">{row.participantName}</TableCell>
                <TableCell>{row.testName}</TableCell>
                <TableCell className="text-muted-foreground max-w-md truncate font-mono text-xs">
                  {safeRenderScores(row.scores, row.patternCode)}
                </TableCell>
                <TableCell className="tabular-nums">{formatIdDate(row.approvedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
