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
import { InstansiCertificateDownloadButton } from "./instansi-certificate-download-button";

interface ResultsTableProps {
  rows: InstansiResultItem[];
  meta: PaginationMeta;
  pageHref: (page: number) => string;
}

/**
 * Institution results list. A result with a live certificate offers its PDF;
 * the institution reads and downloads, it never issues or revokes.
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
              <TableHead className="w-32">Sertifikat</TableHead>
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
                <TableCell>
                  {row.certificate ? (
                    <InstansiCertificateDownloadButton
                      id={row.certificate.id}
                      number={row.certificate.number}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
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
